package sg.gowild.sademo;

import android.app.Activity;
import android.content.Context;
import android.media.AudioFormat;
import android.media.AudioRecord;
import android.media.MediaRecorder;
import android.os.Bundle;
import android.util.Log;

import com.google.android.gms.common.GooglePlayServicesNotAvailableException;
import com.google.android.gms.common.GooglePlayServicesRepairableException;
import com.google.android.gms.security.ProviderInstaller;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.speech.v1beta1.RecognitionConfig;
import com.google.cloud.speech.v1beta1.SpeechGrpc;
import com.google.cloud.speech.v1beta1.SpeechRecognitionAlternative;
import com.google.cloud.speech.v1beta1.StreamingRecognitionConfig;
import com.google.cloud.speech.v1beta1.StreamingRecognitionResult;
import com.google.cloud.speech.v1beta1.StreamingRecognizeRequest;
import com.google.cloud.speech.v1beta1.StreamingRecognizeResponse;
import com.google.protobuf.ByteString;

import java.io.IOException;
import java.io.InputStream;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.Executors;

import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import io.grpc.auth.ClientAuthInterceptor;
import io.grpc.stub.StreamObserver;

public class CloudSpeechRecognizer {
    private static final String TAG = CloudSpeechRecognizer.class.getSimpleName();

    private static final String HOST = "speech.googleapis.com";
    private static final int PORT = 443;
    private static final List<String> OAUTH2_SCOPES = Collections.singletonList("https://www.googleapis.com/auth/cloud-platform");

    private static final int SAMPLE_RATE = 16000;
    private static final int CHANNELS = AudioFormat.CHANNEL_IN_MONO;
    private static final int ENCODING = AudioFormat.ENCODING_PCM_16BIT;

    private final SpeechGrpc.SpeechStub speechClient;

    private StreamObserver<StreamingRecognizeResponse> responseObserver;
    private StreamObserver<StreamingRecognizeRequest> requestObserver;

    private AudioRecord recorder = null;
    private int bufferSize;
    private boolean listen;

    public CloudSpeechRecognizer(Context context, InputStream authorizationInputStream) throws IOException {
        try {
            ProviderInstaller.installIfNeeded(context);
        } catch (GooglePlayServicesRepairableException | GooglePlayServicesNotAvailableException e) {
            Log.e(TAG, e.getMessage(), e);
        }

        ManagedChannel channel = createChannel(authorizationInputStream);

        this.bufferSize = AudioRecord.getMinBufferSize(SAMPLE_RATE, CHANNELS, ENCODING);

        this.speechClient = SpeechGrpc.newStub(channel);
        this.responseObserver = null;
        this.requestObserver = null;
        this.listen = false;
    }

    public void startListening(final Activity activity, final String languageCode, final OnAsrResultListener onAsrResultListener) {
        Runnable runnable = new Runnable() {
            @Override
            public void run() {
                listenSync(activity, languageCode, onAsrResultListener);
            }
        };
        Threadings.runInBackgroundThread(runnable);
    }

    private void listenSync(Activity activity, String languageCode, OnAsrResultListener onAsrResultListener) {
        // Creating Connection
        this.responseObserver = getResponseObserver(activity, onAsrResultListener);
        this.requestObserver = speechClient.streamingRecognize(responseObserver);

        Log.d(TAG, "Connected to ASR Server");

        // Send Initial Request
        StreamingRecognizeRequest initial = buildFirstRequest(languageCode);
        this.requestObserver.onNext(initial);

        // Start Recording Audio
        recorder = new AudioRecord(MediaRecorder.AudioSource.MIC,
                SAMPLE_RATE,
                CHANNELS,
                ENCODING,
                bufferSize);
        recorder.startRecording();
        listen = true;
        Log.d(TAG, "Microphone started recording");

        // Loop to Record Audio
        byte[] buffer = new byte[bufferSize];
        int readSize = recorder.read(buffer, 0, bufferSize);
        while (readSize > 0 && listen) {
            // Create Request
            StreamingRecognizeRequest request =
                    StreamingRecognizeRequest.newBuilder()
                            .setAudioContent(ByteString.copyFrom(buffer, 0, readSize))
                            .build();

            // Send Request
            if (requestObserver == null) {
                Log.d(TAG, "Request Observer is null, breaking record loop");
                break;
            }
            requestObserver.onNext(request);

            // Get next audio
            readSize = recorder.read(buffer, 0, bufferSize);
        }

        Log.d(TAG, "End of Request");

        // Stop Recording Audio
        recorder.stop();
        recorder.release();
        recorder = null;
        Log.d(TAG, "Microphone stopped recording");

        // Stop Connection if still conneted
        killConnectionIfNeeded();
    }

    public void stopListening() {
        listen = false;
    }

    private StreamingRecognizeRequest buildFirstRequest(String languageCode) {
        String sanitizedLanguageCode = getLanguageCode(languageCode);
        RecognitionConfig config =
                RecognitionConfig.newBuilder()
                        .setEncoding(RecognitionConfig.AudioEncoding.LINEAR16)
                        .setSampleRate(SAMPLE_RATE)
                        .setLanguageCode(sanitizedLanguageCode)
                        .build();

        StreamingRecognitionConfig streamingConfig =
                StreamingRecognitionConfig.newBuilder()
                        .setConfig(config)
                        .setInterimResults(true)
                        .setSingleUtterance(true)
                        .build();

        // First request
        return StreamingRecognizeRequest.newBuilder()
                .setStreamingConfig(streamingConfig)
                .build();
    }

    private String getLanguageCode(String rawCode) {
        if (rawCode == null || rawCode.isEmpty()) {
            Log.e(TAG, "Language code is null or empty, defaulting to 'en-US'");
            return "en-US";
        } else {
            return rawCode;
        }
    }

    private ManagedChannel createChannel(InputStream authorizationFile) throws IOException {

        GoogleCredentials creds = GoogleCredentials.fromStream(authorizationFile);
        creds = creds.createScoped(OAUTH2_SCOPES);
        return ManagedChannelBuilder.forAddress(HOST, PORT)
                .intercept(new ClientAuthInterceptor(creds, Executors.newSingleThreadExecutor()))
                .build();
    }

    private StreamObserver<StreamingRecognizeResponse> getResponseObserver(final Activity activity,
                                                                           final OnAsrResultListener onAsrResultListener) {
        return new StreamObserver<StreamingRecognizeResponse>() {
            @Override
            public void onNext(StreamingRecognizeResponse response) {
                int numOfResults = response.getResultsCount();
                Log.d(TAG, "ASR Number of Results: " + Integer.toString(numOfResults));

                if (numOfResults > 0) {
                    for (int i = 0; i < numOfResults; i++) {
                        StreamingRecognitionResult result = response.getResultsList().get(i);
                        SpeechRecognitionAlternative alternative = result.getAlternatives(0);
                        final String text = alternative.getTranscript();
                        final float confidence = alternative.getConfidence();

                        if (result.getIsFinal()) {
                            Log.d(TAG, "Final Result: " + text);
                            if (onAsrResultListener != null) {
                                Runnable uiRunnable = new Runnable() {
                                    @Override
                                    public void run() {
                                        onAsrResultListener.onResult(text, confidence);
                                    }
                                };
                                Threadings.runInMainThread(activity, uiRunnable);
                            }

                            // Stopping Request Observer, end connection
                            killConnectionIfNeeded();
                        } else {
                            Log.d(TAG, "Partial Result: " + text);
                        }
                    }
                }
            }

            @Override
            public void onError(Throwable error) {
                Log.w(TAG, "ASR failed: {0}", error);
                if (onAsrResultListener != null) {
                    onAsrResultListener.onError(error);
                }

                stopListening();
            }

            @Override
            public void onCompleted() {
                Log.i(TAG, "ASR completed");
                stopListening();
            }
        };
    }

    private synchronized void killConnectionIfNeeded() {
        if (requestObserver != null) {
            Log.d(TAG, "Killing connection by onCompleted");
            requestObserver.onCompleted();
            requestObserver = null;
        }
    }

    public interface OnAsrResultListener {
        void onReadyForSpeech(Bundle params);

        void onResult(String text, float confidence);

        void onError(Throwable e);
    }
}

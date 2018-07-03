package sg.gowild.sademo;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.media.AudioFormat;
import android.media.AudioRecord;
import android.media.MediaPlayer;
import android.media.MediaRecorder;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Environment;
import android.speech.RecognitionListener;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;
import android.speech.tts.TextToSpeech;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.webkit.URLUtil;
import android.widget.Button;
import android.widget.TextView;
import java.io.UnsupportedEncodingException;

import java.net.MalformedURLException;
import android.media.MediaPlayer;
import android.media.MediaPlayer.OnCompletionListener;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
//import java.net.ProtocolException;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import ai.api.AIConfiguration;
import ai.api.AIDataService;
import ai.api.AIServiceException;
import ai.api.model.AIRequest;
import ai.api.model.AIResponse;
import ai.api.model.Fulfillment;
import ai.api.model.Result;
import ai.kitt.snowboy.SnowboyDetect;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Base64;
import java.util.Random;

import javax.net.ssl.HttpsURLConnection;

public class MainActivity extends AppCompatActivity {
    // View Variables
    private Button button;
    private TextView textView;
    private TextView textView2;
    // ASR Variables
    private SpeechRecognizer speechRecognizer;

    // TTS Variables
    private TextToSpeech textToSpeech;

    // NLU Variables
    private AIDataService aiDataService;

    // Hotword Variables
    private boolean shouldDetect;
    private SnowboyDetect snowboyDetect;
    private MediaPlayer mp;
    private final String USER_AGENT = "Mozilla/5.0";

    static {
        System.loadLibrary("snowboy-detect-android");
    }


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // TODO: Setup Components
        setupViews();
        //setupXiaoBaiButton();
        setupAsr();
        setupTts();
        setupNlu();
        setupHotword();
        // talk to database

        MainActivity http = new MainActivity();

       /* System.out.println("Testing 1 - Send Http GET request");
        try {
            sendGet();
        } catch (Exception e) {
            e.printStackTrace();
        } */

        System.out.println("\nTesting 2 - Send Http POST request");
        new GetUrlContentTask().execute("");
    /*    try {
            AsyncT asyncT = new AsyncT();
            asyncT.execute();
        } catch (Exception e) {
            e.printStackTrace();
        } */

        /*try {
            URL url = new URL ("");
            //String authStr = user + ":" + pass;
           // String authEncoded = Base64.encodeBytes(authStr.getBytes());

            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("POST");
            connection.setDoOutput(true);
            connection.setRequestProperty  ("Authorization", "Basic " );
            InputStream content = (InputStream)connection.getInputStream();
            BufferedReader in   =
                    new BufferedReader (new InputStreamReader (content));
            String line;
            while ((line = in.readLine()) != null) {
                System.out.println(line);
            }
        } catch(Exception e) {
            e.printStackTrace();
        } */

        // TODO: Start Hotword
        textView2.setText("Listening to Hotword");
        startHotword();
    }

    private void setupViews() {
        textView = findViewById(R.id.textview);
        textView2 = findViewById(R.id.textview2);
        /* button = findViewById(R.id.button);*/

      /*  button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startAsr();
            }
        }); */
    }
/*
    private void setupXiaoBaiButton() {
        String BUTTON_ACTION = "com.gowild.action.clickDown_action";

        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction(BUTTON_ACTION);

        BroadcastReceiver broadcastReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                // TODO: Add action to do after button press is detected
                startAsr();
            }
        };
        registerReceiver(broadcastReceiver, intentFilter);
    } */

    private int playGame = 0;
    private int gameNum = 0;
    private int maxLength = 0;
    private int endOfGame = 0;

    private void setupAsr() {
        speechRecognizer = SpeechRecognizer.createSpeechRecognizer(this);
        speechRecognizer.setRecognitionListener(new RecognitionListener() {
            @Override
            public void onReadyForSpeech(Bundle params) {
                // Ignore
                Log.d("asr","you can start speaking now");
                textView2.setText("You can start speaking now");
            }

            @Override
            public void onBeginningOfSpeech() {
                // Ignore
            }

            @Override
            public void onRmsChanged(float rmsdB) {
                // Ignore
            }

            @Override
            public void onBufferReceived(byte[] buffer) {
                // Ignore
            }

            @Override
            public void onEndOfSpeech() {
                // Ignore
            }

            @Override
            public void onError(int error) {
                Log.e("asr", "Error: " + Integer.toString(error));
                textView2.setText("Listening to Hotword");
                startHotword();
            }

            @Override
            public void onResults(Bundle results) {
                List<String> texts = results.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
                if (texts == null || texts.isEmpty()) {
                    textView.setText("Please try again");
                } else {
                    String text = texts.get(0);

                    textView.setText(text);

                    if(text.equalsIgnoreCase("Hello")){

                    } else {
                        try {
                            //sendPost(text);

                            new AsyncT().execute(text);


                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }

                    maxLength =  gameData.size();
                    if(playGame == 1){

                        if(text.equalsIgnoreCase("stop game")){
                            playGame = 0;
                        } else if(text.equalsIgnoreCase(gameData.get(gameNum).answers)){
                            mp = MediaPlayer.create(MainActivity.this, R.raw.correct);

                            mp.start();
                            while(mp.isPlaying());
                            mp.stop();

                            new gameScore().execute("1",gameData.get(gameNum).questions);

                            if((maxLength-1) == gameNum ){
                                startTts("End of game");
                                //playGame = 0;
                                endOfGame = 1;
                            } else {
                                gameNum += 1;
                                Log.d("number" , String.valueOf(gameNum));
                                startTts(gameData.get(gameNum).questions);
                            }

                        } else {
                            mp = MediaPlayer.create(MainActivity.this, R.raw.wrong);
                            mp.start();
                            while(mp.isPlaying());
                            mp.stop();
                            new gameScore().execute("0",gameData.get(gameNum).questions);

                            if((maxLength-1) == gameNum ){
                                startTts("End of game");
                                //playGame = 0;
                                endOfGame = 1;
                            } else {
                                gameNum += 1;
                                Log.d("wrong - number" , String.valueOf(gameNum));
                                startTts(gameData.get(gameNum).questions);
                            }
                        }

                    }

                    if(text.equalsIgnoreCase("Game Time")){
                        endOfGame = 0;
                       playGame = 1;
                       startTts(gameData.get(gameNum).questions);

                    } else if(endOfGame == 1){
                        playGame =0;
                    } else if(playGame == 1){
                        //startAsr();
                    }
                    else {
                        startNlu(text);
                    }



                }
            }

            @Override
            public void onPartialResults(Bundle partialResults) {
                // Ignore
            }

            @Override
            public void onEvent(int eventType, Bundle params) {
                // Ignore
            }
        });
    }

    private void startAsr() {
        Runnable runnable = new Runnable() {
            @Override
            public void run() {
                // TODO: Set Language
                final Intent recognizerIntent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
                recognizerIntent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_PREFERENCE, "en");
                recognizerIntent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, "en");
                recognizerIntent.putExtra(RecognizerIntent.EXTRA_CALLING_PACKAGE, getPackageName());
                recognizerIntent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_WEB_SEARCH);
                recognizerIntent.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 3);

                // Stop hotword detection in case it is still running
                shouldDetect = false;

                // TODO: Start ASR
                speechRecognizer.startListening(recognizerIntent);
            }
        };
        Threadings.runInMainThread(this, runnable);
    }

    private void setupTts() {
        // TODO: Setup TTS
        textToSpeech = new TextToSpeech(this, null);
    }

    private void startTts(final String text) {
        // TODO: Start TTS
        String song = text.substring(0,4);

        if (text.equalsIgnoreCase("song1")) {
           // mp.stop();
            mp = MediaPlayer.create(MainActivity.this, R.raw.shark);
            mp.start();
        } else if(text.equalsIgnoreCase("song2")){
           // mp.stop();
            mp = MediaPlayer.create(MainActivity.this, R.raw.mary);
            mp.start();
        } else if(song.equalsIgnoreCase("Sing")){
            String songName = text.substring(5);



                   mp = MediaPlayer.create(this, Uri.parse("https://mimibotupload.blob.core.windows.net/uploads/" + songName.toUpperCase()));
                    if(mp == null){

                       // startTts("Song does not exist");
                    } else
                    {
                        mp.start();
                    }



                   //startTts("Song does not Exist");






        }
        else {
            Log.e("tts", "startTts: " );
            textToSpeech.speak(text, TextToSpeech.QUEUE_FLUSH, null);
        }


        // TODO: Wait for end and start hotword
        Runnable runnable = new Runnable() {
            @Override
            public void run() {
                while (textToSpeech.isSpeaking()) {
                    try {
                        Thread.sleep(100);
                    } catch (InterruptedException e) {
                        Log.e("tts", e.getMessage(), e);
                    }
                }
                if(text.equalsIgnoreCase("stop")){
                    textView2.setText("Listening to Hotword");
                    //mp.stop();
                    startHotword();
                } else {
                    //mp.stop();
                    textToSpeech.stop();
                    startAsr();
                }

                //startHotword();
            }
        };
        Threadings.runInBackgroundThread(runnable);
    }

    private void setupNlu() {
        // TODO: Change Client Access Token
        String clientAccessToken = "b33bd200e5a3490eadaeca97c6314091";
        AIConfiguration aiConfiguration = new AIConfiguration(clientAccessToken,
                AIConfiguration.SupportedLanguages.English);
        aiDataService = new AIDataService(aiConfiguration);
    }

    private void startNlu(final String text) {
        // TODO: Start NLU
        Runnable runnable = new Runnable() {
            @Override
            public void run() {
                try {
                    AIRequest aiRequest = new AIRequest();
                    aiRequest.setQuery(text);

                    AIResponse aiResponse = aiDataService.request(aiRequest);
                    Result result = aiResponse.getResult();
                    Fulfillment fulfillment = result.getFulfillment();
                    String speech = fulfillment.getSpeech();
                    Log.d("return by dialog flow", speech);
                    if (speech.equalsIgnoreCase("weather_function")) {
                        String weatherSpeech = getWeather();
                        startTts(weatherSpeech);
                    } else {
                        startTts(speech);
                    }
                } catch (AIServiceException e) {
                    Log.e("nlu", e.getMessage(), e);
                    textView2.setText("Listening to Hotword");
                    startHotword();

                }
            }
        };
        Threadings.runInBackgroundThread(runnable);
    }

    private void setupHotword() {
        shouldDetect = false;
        SnowboyUtils.copyAssets(this);

        // TODO: Setup Model File
        File snowboyDirectory = SnowboyUtils.getSnowboyDirectory();
        File model = new File(snowboyDirectory, "alexa_02092017.umdl");
        File common = new File(snowboyDirectory, "common.res");

        // TODO: Set Sensitivity
        snowboyDetect = new SnowboyDetect(common.getAbsolutePath(), model.getAbsolutePath());
        snowboyDetect.setSensitivity("0.50");
        snowboyDetect.applyFrontend(true);
    }

    private void startHotword() {
        Runnable runnable = new Runnable() {
            @Override
            public void run() {
                shouldDetect = true;
                android.os.Process.setThreadPriority(android.os.Process.THREAD_PRIORITY_AUDIO);

                int bufferSize = 3200;
                byte[] audioBuffer = new byte[bufferSize];
                AudioRecord audioRecord = new AudioRecord(
                        MediaRecorder.AudioSource.DEFAULT,
                        16000,
                        AudioFormat.CHANNEL_IN_MONO,
                        AudioFormat.ENCODING_PCM_16BIT,
                        bufferSize
                );

                if (audioRecord.getState() != AudioRecord.STATE_INITIALIZED) {
                    Log.e("hotword", "audio record fail to initialize");
                    return;
                }

                audioRecord.startRecording();
                Log.d("hotword", "start listening to hotword");

                while (shouldDetect) {
                    audioRecord.read(audioBuffer, 0, audioBuffer.length);

                    short[] shortArray = new short[audioBuffer.length / 2];
                    ByteBuffer.wrap(audioBuffer).order(ByteOrder.LITTLE_ENDIAN).asShortBuffer().get(shortArray);

                    int result = snowboyDetect.runDetection(shortArray, shortArray.length);
                    if (result > 0) {
                        Log.d("hotword", "detected");
                        shouldDetect = false;
                    }
                }

                audioRecord.stop();
                audioRecord.release();
                Log.d("hotword", "stop listening to hotword");

                // TODO: Add action after hotword is detected
                startAsr();
            }
        };
        Threadings.runInBackgroundThread(runnable);
    }

    private String getWeather() {
        // TODO: (Optional) Get Weather Data via REST API
        OkHttpClient okHttpClient = new OkHttpClient();
        Request request = new Request.Builder()
                .url("https://api.data.gov.sg/v1/environment/2-hour-weather-forecast")
                .addHeader("accept", "application/json")
                .build();

        try {
            Response response = okHttpClient.newCall(request).execute();
            String responseString = response.body().string();

            JSONObject jsonObject = new JSONObject(responseString);
            JSONArray forecasts = jsonObject.getJSONArray("items")
                    .getJSONObject(0)
                    .getJSONArray("forecasts");

            for (int i = 0; i < forecasts.length(); i++) {
                JSONObject forecastObject = forecasts.getJSONObject(i);
                String area = forecastObject.getString("area");

                if (area.equalsIgnoreCase("clementi")) {
                    String forecast = forecastObject.getString("forecast");
                    return "The weather in clementi is now " + forecast;
                }
            }
        } catch (IOException | JSONException e) {
            Log.e("weather", e.getMessage(), e);
        }

        return "No weather info";
    }


    Calendar calendar = Calendar.getInstance();
    Date date = calendar.getTime();
    // HTTP POST request
    class gameScore extends AsyncTask<String,Void,Void> {

        private Exception exception;
        String response = "";


        protected Void doInBackground(String... text) {

            HttpURLConnection httpURLConnection = null;

            try {
                URL url = new URL("https://mimiwebserver.azurewebsites.net/api/Marks"); //Enter URL here
                httpURLConnection = (HttpURLConnection) url.openConnection();
                httpURLConnection.setDoOutput(true);
                httpURLConnection.setDoInput(true);
                httpURLConnection.setRequestMethod("POST"); // here you are telling that it is a POST request, which can be changed into "PUT", "GET", "DELETE" etc.
                httpURLConnection.setRequestProperty("Content-Type", "application/json"); // here you are setting the `Content-Type` for the data you are sending which is `application/json`
                httpURLConnection.connect();

                Random r = new Random();

                JSONObject jsonObject = new JSONObject();
                jsonObject.put("markId", String.valueOf(r.nextInt(999999999) + r.nextInt(99999995)));
                jsonObject.put("userId" , "string");
                jsonObject.put("question",text[1]);
                jsonObject.put("markValue",text[0]);
                jsonObject.put("date",new SimpleDateFormat("EEEE", Locale.ENGLISH).format(date.getTime()));
                //jsonObject.put("speechDetails", text[0]);
                //Log.e("log", text[0] + "hello testing");
               // jsonObject.put("userId", "string");
               // jsonObject.put("tags", "string");

                DataOutputStream wr = new DataOutputStream(httpURLConnection.getOutputStream());
                wr.writeBytes(jsonObject.toString());
                wr.flush();
                wr.close();

                int responseCode = httpURLConnection.getResponseCode();

                if (responseCode == HttpsURLConnection.HTTP_OK) {
                    String line;
                    BufferedReader br = new BufferedReader(new InputStreamReader(httpURLConnection.getInputStream()));
                    while ((line = br.readLine()) != null) {
                        response += line;
                    }
                } else {
                    response = "";
                }
                Log.e("log", response);
                Log.e("log", "sent data");
            } catch (IOException e) {
                e.printStackTrace();
            } catch (JSONException e) {
                e.printStackTrace();
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                if (httpURLConnection != null) // Make sure the connection is not null.
                    httpURLConnection.disconnect();

            }

            return null;
        }
    }

    // HTTP GET request
    private void sendGet() throws Exception {

        String url = "https://mimiwebserver.azurewebsites.net/api/Games";

        URL obj = new URL(url);
        HttpURLConnection con = (HttpURLConnection) obj.openConnection();

        // optional default is GET
        con.setRequestMethod("GET");

        //add request header
        con.setRequestProperty("User-Agent", USER_AGENT);

        int responseCode = con.getResponseCode();
        System.out.println("\nSending 'GET' request to URL : " + url);
        System.out.println("Response Code : " + responseCode);

        BufferedReader in = new BufferedReader(
                new InputStreamReader(con.getInputStream()));
        String inputLine;
        StringBuffer response = new StringBuffer();

        while ((inputLine = in.readLine()) != null) {
            response.append(inputLine);
        }
        in.close();

        //print result
        System.out.println(response.toString());

    }
    ArrayList<game> gameData= new ArrayList<>();

    StringBuilder sb = new StringBuilder();

    private class GetUrlContentTask extends AsyncTask<String, Integer, String> {
        protected String doInBackground(String... urls) {
            URL url = null;
            String content = "";
            String line = "";

            try {
                url = new URL("https://mimiwebserver.azurewebsites.net/api/Games");

                HttpURLConnection connection = (HttpURLConnection) url.openConnection();
                connection.setRequestMethod("GET");
                connection.setDoOutput(true);
                connection.setConnectTimeout(5000);
                connection.setReadTimeout(5000);
                connection.connect();

                BufferedReader rd = new BufferedReader(new InputStreamReader(url.openStream()));
                while ((line = rd.readLine()) != null) {
                    Log.d("line", line);
                    sb.append(line);
                    content += line + "\n";

                    Log.d("get info", content);
                   //gameData.add(content[0].gameId);
                }

                try {
                    JSONArray jsonArray = new JSONArray(sb.toString());

                    for (int i = 0; i < jsonArray.length(); i++) {
                        JSONObject json1 = jsonArray.getJSONObject(i);

                        game newGame = new game(json1.getString("questions"),json1.getString("answers"));
                        gameData.add(newGame);
                        Log.d("game Data", gameData.get(i).questions.toString());
                        Log.d("game Data", gameData.get(i).answers);
                    }
                    //JSONArray questionsArray = new JSONArray(json.getString("questions"));


                } catch (JSONException e) {
                    e.printStackTrace();
                }



            } catch (MalformedURLException e) {
                e.printStackTrace();
            }  catch (IOException e) {
                e.printStackTrace();
            }


            return content;
        }

        protected void onProgressUpdate(Integer... progress) {
        }

        protected void onPostExecute(String result) {
            // this is executed on the main thread after the process is over
            // update your UI here
            //displayMessage(result);
        }
    }

    // HTTP POST request
    class AsyncT extends AsyncTask<String,Void,Void>{

        private Exception exception;
        String response = "";


        protected Void doInBackground(String... text) {

            HttpURLConnection httpURLConnection = null;

            try {
                URL url = new URL("https://mimiwebserver.azurewebsites.net/api/Speeches"); //Enter URL here
                httpURLConnection = (HttpURLConnection) url.openConnection();
                httpURLConnection.setDoOutput(true);
                httpURLConnection.setDoInput(true);
                httpURLConnection.setRequestMethod("POST"); // here you are telling that it is a POST request, which can be changed into "PUT", "GET", "DELETE" etc.
                httpURLConnection.setRequestProperty("Content-Type", "application/json"); // here you are setting the `Content-Type` for the data you are sending which is `application/json`
                httpURLConnection.connect();

                Random r = new Random();

                JSONObject jsonObject = new JSONObject();
                jsonObject.put("speechId", String.valueOf(r.nextInt(999999999) + r.nextInt(99999995)));
                jsonObject.put("speechDetails", text[0]);
                Log.e("log", text[0] + "hello testing");
                jsonObject.put("userId", "string");
                jsonObject.put("tags", "string");

                DataOutputStream wr = new DataOutputStream(httpURLConnection.getOutputStream());
                wr.writeBytes(jsonObject.toString());
                wr.flush();
                wr.close();

                int responseCode = httpURLConnection.getResponseCode();

                if (responseCode == HttpsURLConnection.HTTP_OK) {
                    String line;
                    BufferedReader br = new BufferedReader(new InputStreamReader(httpURLConnection.getInputStream()));
                    while ((line = br.readLine()) != null) {
                        response += line;
                    }
                }
                else {
                    response = "";
                }
                Log.e("log",response);
                Log.e("log", "sent data");
            } catch (IOException e) {
                e.printStackTrace();
            } catch (JSONException e) {
                e.printStackTrace();
            }
            catch(Exception e) {
                e.printStackTrace();
            }

            finally {
                if( httpURLConnection != null) // Make sure the connection is not null.
                    httpURLConnection.disconnect();

            }

            return null;
        }




        protected void onPostExecute() {
            // TODO: check this.exception
            // TODO: do something with the feed
        }
    }


    // HTTP POST request
    private void sendPost(String text) throws Exception {

        String url = "https://mimiwebserver.azurewebsites.net/api/Speeches";
        URL obj = new URL(url);
        HttpsURLConnection con = (HttpsURLConnection) obj.openConnection();

        //add reuqest header
        con.setRequestMethod("POST");
        con.setRequestProperty("User-Agent", USER_AGENT);
        con.setRequestProperty("Accept-Language", "en-US,en;q=0.5");

        Random r = new Random();

        JSONObject jsonObject = new JSONObject();
        jsonObject.put("stringId", r.nextInt(999999999) + r.nextInt(99999995));
        jsonObject.put("speechDetails", text);
        jsonObject.put("userId", "string");
        jsonObject.put("tags", "string");

       // String urlParameters = "sn=C02G8416DRJM&cn=&locale=&caller=&num=12345";

        // Send post request
        con.setDoOutput(true);
        DataOutputStream wr = new DataOutputStream(con.getOutputStream());
        wr.writeBytes(jsonObject.toString());
        wr.flush();
        wr.close();

        int responseCode = con.getResponseCode();
        System.out.println("\nSending 'POST' request to URL : " + url);
        System.out.println("Post parameters : " + jsonObject.toString());
        System.out.println("Response Code : " + responseCode);

        BufferedReader in = new BufferedReader(
                new InputStreamReader(con.getInputStream()));
        String inputLine;
        StringBuffer response = new StringBuffer();

        while ((inputLine = in.readLine()) != null) {
            response.append(inputLine);
        }
        in.close();

        //print result
        System.out.println(response.toString());

    }

}



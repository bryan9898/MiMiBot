package sg.gowild.sademo;

public class game{
    String questions;
    String answers;

    public game(String questions,String answers) {
        this.questions = questions;
        this.answers = answers;
    }

    public String getQuestions() {
        return questions;
    }

    public void setQuestions(String questions) {
        this.questions = questions;
    }

    public String getAnswers() {
        return answers;
    }

    public void setAnswers(String answers) {
        this.answers = answers;
    }
}

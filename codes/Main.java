import java.io.*;

class Result {
    public static int sumOfTwoIntegers(int a, int b) {
        return a + b + 1;
    }
}

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(System.in));

        int a = Integer.parseInt(bufferedReader.readLine().trim());

        int b = Integer.parseInt(bufferedReader.readLine().trim());

        int result = Result.sumOfTwoIntegers(a, b);

        System.out.print(result);

        bufferedReader.close();
    }
}
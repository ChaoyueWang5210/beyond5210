import java.io.*;	
import java.net.*;	
public class myClient {

	public static void main(String[] args) {
		String host = null;
		int port = 80;
		String request = null;
		String fileName = null;
		
		if(args.length != 0){
			host = args[0];
			String portStr = args[1];	
			request = args[2];
			fileName = args[3];
			try{
				port = Integer.parseInt(portStr); 
			}
			catch(NumberFormatException e){
				System.out.println("Invalid port number, will defaul to 80");
				port = 80;
			}
		}
		else{
			System.out.println("Input is none, please input a valid commend");
			System.exit(-1);
		}
		
		switch(request.toUpperCase()){
		case "PUT":		
			System.out.println("PUT to server...");
			System.out.println("PUT " + putRequest(host, port, fileName));
			break;
		case "GET":			
			System.out.println("GET request from server...");
			System.out.println("GET " + getRequest(host, port, fileName));
			System.out.println("-----------------------------------------");
			break;
		default:
			System.out.println("Request not valid, please input request wither GET or PUT.");
			break;
		}
	}
	
	public static String getRequest(String host, int port, String fileName){
		
		try{
		Socket socket = new Socket(host, port);
		OutputStream output = socket.getOutputStream();
		InputStream input = socket.getInputStream();
		StringBuffer strBuf = new StringBuffer();
		strBuf.append("GET /" + fileName + " HTTP/1.0\r\n");
		strBuf.append("Host: "+ host + "\r\n");
		strBuf.append("Connection: keep-alive\r\n");
		strBuf.append("user-agent:Mozilla/5.0\r\n");
		strBuf.append("text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");
		strBuf.append("Accept-Encoding: gzip,deflate,sdch");
		strBuf.append("Accept-language: en-US,en;q=0.8\r\n");
		strBuf.append("Accept-Charset: ISO-8859-1,utf-8;q=0.7,*;q=0.3\r\n");
		strBuf.append("\r\n");
		output.write(strBuf.toString().getBytes());
		output.flush();
		
		BufferedReader reader = new BufferedReader(new InputStreamReader(input));
		String message="";
		System.out.println("response:\r\n");
		while((message = reader.readLine()) != null){
			System.out.println(message);
			}
		output.close();
		input.close();
		socket.close();
		System.out.println("-----------------------------------------");
		return "Finished.";
		}
		catch (UnknownHostException e){
			System.out.println("Host not found: " + e.getMessage());
			System.out.println("-----------------------------------------");
			return "Fail";
		}
		catch(IOException ioe){
			System.out.println("I/O Error: " + ioe.getMessage());
			System.out.println("-----------------------------------------");
			return "Fail";
		}
	}
	
	public static String putRequest(String host, int port, String fileName){
		try{
			String fileContent = "empty";
			Socket socket2 = new Socket(host, port);
			OutputStream output = socket2.getOutputStream();
			InputStream input = socket2.getInputStream();
				FileReader fileReader = new FileReader(fileName);
				BufferedReader bufReader = new BufferedReader(fileReader);
				while(bufReader.ready()){
					fileContent = bufReader.readLine();
					System.out.println(fileContent);
				}
			
			StringBuffer strBuf = new StringBuffer();
			strBuf.append("PUT /" + fileName + " HTTP/1.0\r\n");
			strBuf.append("Host: "+ host + "\r\n");
			strBuf.append("Content: " + fileContent + "\r\n");
			strBuf.append("Content-Length: " + fileContent.length() + "\r\n");
			strBuf.append("Content-type: text/text,text/html,application/xhtml+xml,application/xml\r\n");
			strBuf.append("Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8\r\n");
			strBuf.append("Accept-Encoding: utf-8,gzip,deflate,sdch\r\n");
			strBuf.append("Accept-language: zh-cn\r\n");
			strBuf.append("\r\n");
			
			output.write(strBuf.toString().getBytes());
			output.flush();
			
			BufferedReader reader = new BufferedReader(new InputStreamReader(input));
			String message = "";
			System.out.println("response:\r\n");
			while((message = reader.readLine()) != null){
				System.out.println(message);
			}
			bufReader.close();
			fileReader.close();
			output.close();
			input.close();
			socket2.close();
			System.out.println("-----------------------------------------");
			return "Sucessful";
		}
		catch (UnknownHostException e){
			System.out.println("Host not found:" + e.getMessage());
			System.out.println("-----------------------------------------");
			return "Fail";
		}
		catch(IOException ioe){
			System.out.println("I/O Error:" + ioe.getMessage());
			System.out.println("Fail to read file: " + fileName);
			ioe.printStackTrace();
			System.out.println("-----------------------------------------");
			return "Fail";
		}
		catch(Exception e){
			e.printStackTrace();
			return "Fail";
		}
	}

}

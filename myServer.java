import java.io.*;
import java.net.*;

public class myServer {

	public static void main(String[] args) {
		
		int port = Integer.parseInt(args[0]);
		int myserverHelper = myserverHelper(port);
		while (myserverHelper!=0){
			myserverHelper = myserverHelper(port);
		}
		if(myserverHelper==0)
			System.exit(-1);		
	}
	
	public static int myserverHelper(int port){
		String fileName;
		String fileContent="";
		
		try {

			ServerSocket serverSocket = new ServerSocket(port);
			System.out.println("Server is waiting for a connection on host="
					+ InetAddress.getLocalHost().getCanonicalHostName()
					+ " port=" + serverSocket.getLocalPort() + "...");
			Socket clientSocket = serverSocket.accept();		
			BufferedReader input = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
			OutputStream output = clientSocket.getOutputStream();
			String buf = input.readLine();
			if (buf != null) {
				switch (buf.substring(0, 3).toUpperCase()) {
				case "PUT":
					try{
		
						fileName="server_" + buf.substring(5, buf.length()-9);
						File file = new File(fileName);	
						file.createNewFile();
						BufferedReader bufReader = new BufferedReader(input);
						FileWriter fileWriter = new FileWriter(fileName);
						BufferedWriter bufWriter = new BufferedWriter(fileWriter);
						System.out.println("--------------------Client Message Begin--------------------");
						while (bufReader.ready()){
							buf = bufReader.readLine();
							System.out.println(buf);
							if(buf.length()>9 && buf.substring(0,9).equals("Content: ")){
								fileContent = buf.substring(9);
								System.out.println("File content: "+ fileContent);
								bufWriter.write(fileContent);
								bufWriter.newLine();
							}
						}
						System.out.println("--------------------Client Message End--------------------");
						System.out.println("Write file " + fileName + " sucess.");
						bufWriter.close();
						System.out.println("File "+ fileName +" is stored on local.");		
						System.out.println("-----------------------------------------");
						StringBuffer strBuf = new StringBuffer();
						strBuf.append("200 OK File Created.\r\n");
						strBuf.append("\r\n");
						output.write(strBuf.toString().getBytes());
						output.flush();
						System.out.println("Sucessful response.");
						System.out.println("-----------------------------------------");
					}
					catch(Exception e){
						System.out.println("PUT response Exception:" + e.getMessage());
					}
					break;
				default:
					System.out.println("Not a valid request.");
					System.exit(-1);
					break;
				case "GET":
					try{
						if(buf.length() > 14 ){
							fileName=buf.substring(5, buf.length()-9);
							System.out.println("Client require get file " + fileName);
							File file = new File(fileName);	
							if(file.exists()){
			
								FileReader fileReader = new FileReader(fileName);
								BufferedReader bufReader = new BufferedReader(fileReader);
								while(bufReader.ready()){
									fileContent += bufReader.readLine();
	
								}
								StringBuffer strBuf = new StringBuffer();
								strBuf.append("/HTTP/1.0 200 OK\r\n");
								strBuf.append("Host: " + InetAddress.getLocalHost().getCanonicalHostName() + "\r\n");
								strBuf.append("Port: " + port + "\r\n");
								strBuf.append("Content: " + fileContent);
								strBuf.append("\r\n");
					
								System.out.println("Responsing client...");
								output.write(strBuf.toString().getBytes());
								output.flush();
								bufReader.close();
							}
							else{
								StringBuffer strBuf = new StringBuffer();
								strBuf.append("/HTTP/1.0 404 Not Found\r\n");
								strBuf.append("Host: " + InetAddress.getLocalHost().getCanonicalHostName() + "\r\n");
								strBuf.append("Port: " + port + "\r\n");
								strBuf.append("\r\n");

								System.out.println("Responsing client...");
								output.write(strBuf.toString().getBytes());
								output.flush();
							}
						}
						System.out.println("Sucessful response.");
						System.out.println("-----------------------------------------");	
					}
					catch (Exception e){
						System.out.println("GET response Exception:"+e.getMessage());
					}
					break;
				}
			}
			output.close();
			input.close();
			clientSocket.close();
			serverSocket.close();
			return 1;
		} catch (IOException ioe) {
			System.out.println("I/O Error:" + ioe.getMessage());
			return 0;
		} catch (Exception e) {
			System.out.println("Exception:" + e.getMessage());
			return 0;
		}
	} 
}

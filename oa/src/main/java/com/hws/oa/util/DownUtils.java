package com.hws.oa.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Arrays;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

public class DownUtils {
	private static final int  BUFFER_SIZE = 2 * 1024;
	private static final String JARFILENAME = "target";
	private static final String ZIPSUFFIX = ".zip";
	private static byte[] buf = new byte[BUFFER_SIZE];
	public static void compress(String[] files,ZipOutputStream zos,String name) throws FileNotFoundException, IOException{
		 
		 for(String temp : files){
			 zos.putNextEntry(new ZipEntry(name));
			 File parentFile = new File(temp);
			 if(!parentFile.exists())continue;
			 List<String> list = Arrays.asList(parentFile.list());
			 if(list.contains(JARFILENAME)){
				 File sourceFile = new File(temp+File.separator+JARFILENAME);
				 for(File file :sourceFile.listFiles()){
					 if(file.isFile()){
						 int len;
				         FileInputStream in = new FileInputStream(file);
				         while ((len = in.read(buf)) != -1){
				             zos.write(buf, 0, len);
				         }
				         in.close();
					 }
				 }
			 }else{
				 compress(parentFile.list(), zos, name);
			 }
		 }
    }
	public static void zipData(String[] path,String name,String targetLocation) throws FileNotFoundException, IOException{
		OutputStream out = new FileOutputStream(new File(targetLocation+File.separator+name+ZIPSUFFIX));
		ZipOutputStream zos = new ZipOutputStream(out);
		File tempFile = new File(targetLocation);
		//如果目录不存在则新建
		if(!tempFile.exists())tempFile.createNewFile();
		compress(path, zos, name);
	}

}
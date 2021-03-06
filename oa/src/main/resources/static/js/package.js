$(function(){
	var loadIndex;
	var packageFlag = false;
	var settingNum = 0;
	var finishFlag = false;
	var rowNum = 0;//总共大概行数
	var currentNum = 0;//记录当前行
	//websocket 初始化
	if ("WebSocket" in window){
		rowNum = getRowNum()-1;
		var jsessionId = $(".jsessionId").val();
		websocket = new WebSocket("ws://"+$(".websocketIp").val()+":"+$(".serverPort").val()+"/websocket/"+jsessionId);
		//连接发生错误的回调方法
	    websocket.onerror = function(){
	    	layer.msg("the websocket server is error!");
	    };
	    //连接成功建立的回调方法
	    websocket.onopen = function(event){
	    }
	    websocket.onmessage = function(event){
	    	currentNum++;
	    	var json = eval("("+event.data+")");
	    	if(json.type=="update"){
	    		if(currentNum>rowNum){
	    			var currentHeight = $(".update_value").scrollTop();
	    			$(".update_value").scrollTop(currentHeight+19+17);
		    	}
	    		$(".update_value").append(json.value+"<br/>");
	    		if(json.isFinish){
		    		layer.close(loadIndex); 
		    		layer.msg($(".operateSuccess-i18n").val());
		    	}
	    	}else{
	    		if(currentNum>rowNum){
	    			var currentHeight = $(".package_value").scrollTop();
	    			$(".package_value").scrollTop(currentHeight+36);
		    	}
	    		$(".package_value").append(json.value+"<br/>");
	    		if(json.isFinish){
		    		layer.close(loadIndex); 
		    		if(json.flag){
		    			finishFlag = true;
		    			layer.msg($(".operateSuccess-i18n").val());
		    		}else{
		    			layer.msg($(".operateFailure-i18n").val());
		    		}
		    		
		    	}
	    	}
	    	
	    	
	    }
	    //连接关闭的回调方法
	    websocket.onclose = function(){
	    }
	    //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
	    window.onbeforeunload = function(){
	        websocket.close();
	    }
	    //关闭连接
	    function closeWebSocket(){
	        websocket.close();
	    }
	}else{
		layer.msg("your browser is not support websocket!");
	}
	
	//获取行数
	function getRowNum(){
		var targetHeight = $(".update_value").height();
		//19为行高度，17为行于行之间的间隔
		return (targetHeight - 10)/(19+17);
	}
	
	$(".center_div").on("click",".update",function(){
		var data = {
			};
		var url = "/getSettings";
		var s_function = function(data){
			if(data.flag){
				var dataValue = "<div><table class='table table-bordered table-hover definewidth m10'><tr><td>"+$(".serialNumber-i18n").val()
				+"</td><td>"+$(".localAddress-i18n").val()+"</td><td>"+$(".remoteAddress-i18n").val()+"</td><td></td></tr>";
				for(var i=0;i<data.Settings.length;i++){
					dataValue += "<tr><td>"+(i+1)+"</td><td>"+data.Settings[i].localRepo+"</td><td>"
					+data.Settings[i].remoteRepo+"</td><td><input type='radio'  name='settings' value='"+(i+1)+"' ></td></tr>"
				}
				dataValue += "</table></div>";
				layer.open({
				  title: $(".sysSet-i18n").val(),
				  content: dataValue,
				  area: ['700px', '400px'],
				  type: 1,
				  maxmin: true,            //最大化按钮
			  	  anim:3,                    //动画
			  	  shade: [0.8, '#393D49'],//遮罩层
			  	  btn: [$(".confirm-i18n").val()],
			  	  yes: function(index, layero){
			  		var num = $('input[name="settings"]:checked').val();
			  		if(num != undefined){
			  			layer.close(index);
			  			$(".update_value").empty();
			  			//第二次更新代码此时也需要清空当前行记录
			  			currentNum = 0;
			  			updateCode(num-1);
			  			packageFlag = true;
			  			settingNum = num-1;
			  		}else{
			  			layer.msg($(".pleaseSelect-i18n").val());
			  		}
			  		
				  },
			  	  cancel: function(index, layero){ 
			  	    layer.close(index);
			  	  }
				});
			}else{
				
			}
		}
		var e_function = function(){
			layer.msg("The server is error!!!");
		}
		$.commonAjax(url,data,s_function,e_function);
		
	});
	function updateCode(num){
		var data = {
				num: num,
				jessionId:$(".jsessionId").val(),
			};
		var url = "/update";
		var s_function = function(data){
			if(data.updateFlag){
				$(".code_version").val(data.code_version);
			}else{
				if(!data.hasDiff){
					layer.close(loadIndex); 
					layer.msg("No code update");
				}else{
					layer.msg($(".updateFailure-i18n").val());
				}
			}
		}
		var e_function = function(){
			layer.msg("The server is error!!!");
		}
		loadIndex = layer.load(2);
		$.commonAjax(url,data,s_function,e_function);
	}
	$(".step").on("click",".btn",function(){
		var className = $(this).prop("class");
		if(className.indexOf("btn-info")!= -1){
			if(packageFlag){
				$(".prev_step").addClass("btn-info");
				$(".next_step").addClass("btn-info");
				$(this).removeClass("btn-info");
			}
			var thisValue = $(this).val();
			if(thisValue == 1){
				$(".steptab2").removeClass("btn-info");
				$(".steptab1").addClass("btn-info");
				$(".package_value").css({
					display:"none",
				});
				$(".update_value").css({
					display:"block",
				});
				$(".package_title").css({
					display:"none",
				});
				$(".update_title").css({
					display:"block",
				});
			}else if(thisValue == 2){
				if(packageFlag){
					$(".steptab1").removeClass("btn-info");
					$(".steptab2").addClass("btn-info");
					if(finishFlag){
						$(".finnish").addClass("btn-info");
					}
					$(".update_value").css({
						display:"none",
					});
					$(".package_value").css({
						display:"block",
					});
					$(".package_title").css({
						display:"block",
					});
					$(".update_title").css({
						display:"none",
					});
				}else{
					layer.msg($(".updateFirst-i18n").val());
				}
				
			}else{
				zipData();
			}
		}
	});
	function zipData(){
		var data = {
				addressArr:addressArr,
				version:$(".code_version").val(),
				updateInfo: $(".update_value").html(),
				packageInfo: $(".package_value").html(),
						
			};
		var url = "/zipData";
		var s_function = function(data){
			if(!data.flag){
				layer.msg($(".operateFailure-i18n").val());
			}else{
				layer.close(loadIndex);
				layer.msg($(".operateSuccess-i18n").val());
				window.location.href="/html/versionInfo";
			}
		}
		var e_function = function(){
			layer.close(loadIndex);
			layer.msg("The server is error!!!");
		}
		loadIndex = layer.load(2);
		$.arrayAjax(url,data,s_function,e_function);
	}
	$(".center_div").on("click",".package",function(){
		
		var data = {
				num :settingNum,
			};
		var url = "/getPoms";
		var s_function = function(data){
			if(data.flag){
				var dataValue = "<div><table class='table table-bordered table-hover definewidth m10'><tr><td>"+$(".serialNumber-i18n").val()
				+"</td><td>POM</td><td></td></tr>";
				for(var i=0;i<data.pomList.length;i++){
					dataValue += "<tr><td></td><td>"+data.pomList[i]+"</td>"
					+"<td><input type='checkbox'  name='pom'></td></tr>"
				}
				dataValue += "</table></div>";
				layer.open({
				  title: "POM",
				  content: dataValue,
				  area: ['700px', '400px'],
				  type: 1,
				  maxmin: true,            //最大化按钮
			  	  anim:3,                    //动画
			  	  shade: [0.8, '#393D49'],//遮罩层
			  	  btn: [$(".confirm-i18n").val()],
			  	  yes: function(index, layero){
			  		if(pomFlag==0){
			  			layer.msg($(".pleaseSelect-i18n").val());
			  		}else{
			  			$(".package_value").empty();
			  			//第二次更新代码此时也需要清空当前行记录
			  			currentNum = 0;
			  			mvnPackage();
			  			layer.close(index);
			  		}
			  		
				  },
			  	  cancel: function(index, layero){ 
			  		pomNum = 0;
			  	    layer.close(index);
			  	  }
				});
			}else{
				layer.msg("NO POM File");
			}
		}
		var e_function = function(){
			layer.msg("The server is error!!!");
		}
		$.commonAjax(url,data,s_function,e_function);
		
	});
	var pomNum=0;
	var pomFlag = 0;
	$(this).on("click",":checkbox",function(){
		if($(this).prop("checked")){
			pomNum++;
			pomFlag++;
			$(this).parent().prev().prev().text(pomNum);
		}else{
			$(this).parent().prev().prev().text("");
			pomFlag--;
		}
	});
	var numArr;
	var addressArr
	function mvnPackage(){
		numArr = [];
		addressArr = [];
		$("table input:checkbox").each(function(){
				if($(this).prop("checked")){
					numArr.push($(this).parent().prev().prev().text());
					addressArr.push($(this).parent().prev().text());
				}
			});
		var data = {
				numArr:numArr,
				addressArr:addressArr,
				command:$(".mvn_command").val(),
			};
		var url = "/package";
		var s_function = function(data){
			
		}
		var e_function = function(){
			layer.msg("The server is error!!!");
		}
		loadIndex = layer.load(2);
		$.arrayAjax(url,data,s_function,e_function);
	}
});


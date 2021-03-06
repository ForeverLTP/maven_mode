package com.server.gataway.filter;


import org.springframework.cloud.netflix.zuul.filters.post.SendErrorFilter;

import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;

/**
 * 只处理post过滤器的异常
 * route异常会先通过error过滤器进行处理然后再由post过滤器进行处理
 * 但是post异常通过error过滤器处理后就没有其他过滤器进行处理因此需要进行扩展
 * **：post过滤器会调用SendErrorFilter将一些错误参数填写到Response上。
 * SendErrorFilter的优先级为0(数字越小级别越高),是post阶段第一个执行的过滤器。
 * @author Administrator
 *
 */
public class ErrorExFilter extends SendErrorFilter{

	
	public boolean shouldFilter() {
		RequestContext ctx = RequestContext.getCurrentContext();
		ZuulFilter filter = (ZuulFilter)ctx.get("error.filter");
		if(filter != null && filter.filterType().equals("post"))return true;
		
		return false;
	}

	public String filterType() {
		return "error";
	}

	public int filterOrder() {
		return 30;
	}
}

package com.bdcom.hws.core.shiro;

import java.util.Map;
import java.util.Properties;
import java.util.concurrent.ConcurrentHashMap;











import org.apache.shiro.spring.security.interceptor.AuthorizationAttributeSourceAdvisor;
import org.apache.shiro.spring.web.ShiroFilterFactoryBean;
import org.apache.shiro.web.mgt.DefaultWebSecurityManager;
import org.apache.shiro.web.session.mgt.DefaultWebSessionManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.handler.SimpleMappingExceptionResolver;
import org.apache.shiro.mgt.SecurityManager;



@Configuration
public class ShiroConfiguration {

	//将自己的验证方式加入容器
    @Bean
    public UserRealm myShiroRealm() {
    	UserRealm myShiroRealm = new UserRealm();
        return myShiroRealm;
    }
    
    @Bean(name="sessionManager") 
    public DefaultWebSessionManager sessionManager(){
    	DefaultWebSessionManager sessionManager = new DefaultWebSessionManager();
    	//sessionManager.setGlobalSessionTimeout(20000);
    	return sessionManager;
    	
    }

    //权限管理，配置主要是Realm的管理认证
    @Bean(name="securityManager")
    public SecurityManager securityManager() {
        DefaultWebSecurityManager securityManager = new DefaultWebSecurityManager();
        securityManager.setRealm(myShiroRealm());
        securityManager.setSessionManager(sessionManager());
        return securityManager;
    }
    //Filter工厂，设置对应的过滤条件和跳转条件
    @Bean
    public ShiroFilterFactoryBean shiroFilterFactoryBean(SecurityManager securityManager) {
        ShiroFilterFactoryBean shiroFilterFactoryBean = new ShiroFilterFactoryBean();
        shiroFilterFactoryBean.setSecurityManager(securityManager);
        Map<String,String> map = new ConcurrentHashMap<String, String>();
        //登出
        map.put("/logout","logout");
        //对所有用户认证
        map.put("/**","authc");
        map.put("/user/validate","anon");
        
        //静态资源匿名获取，否则页面将无法获取样式等
        map.put("/static/**", "anon");
        map.put("/css/**", "anon");
        map.put("/swf/**", "anon");
        map.put("/fonts/**", "anon");
        map.put("/img/**", "anon");
        map.put("/js/**", "anon");
        map.put("/layer/**", "anon");
        map.put("/layer/theme/default/**","anon");
        map.put("/layer/mobile/**","anon");
        map.put("/i18n/**","anon");
        //url拦截，匿名提交会自动跳转到登录界面
        shiroFilterFactoryBean.setLoginUrl("/");
        //登录成功首页
        //shiroFilterFactoryBean.setSuccessUrl("/index");
        //错误页面，认证不通过跳转
        shiroFilterFactoryBean.setUnauthorizedUrl("/");
        shiroFilterFactoryBean.setFilterChainDefinitionMap(map);
        return shiroFilterFactoryBean;
    }

    @Bean
    public AuthorizationAttributeSourceAdvisor authorizationAttributeSourceAdvisor(SecurityManager securityManager) {
    	AuthorizationAttributeSourceAdvisor authorizationAttributeSourceAdvisor = new AuthorizationAttributeSourceAdvisor();
        authorizationAttributeSourceAdvisor.setSecurityManager(securityManager);
        return authorizationAttributeSourceAdvisor;
    }
    @Bean
    public SimpleMappingExceptionResolver unauthoriedCatch(){
    	SimpleMappingExceptionResolver exceptionResolver = new SimpleMappingExceptionResolver();
    	Properties exception = new Properties();
    	//value 是页面的名称不是controller中的路径
    	exception.setProperty("org.apache.shiro.authz.UnauthorizedException", "unauthorized");
    	exceptionResolver.setExceptionMappings(exception);
    	return exceptionResolver;
    }
   
}
package com.bdcom.hws.mapper;

import com.bdcom.hws.model.Permission;

public interface PermissionMapper {
    int deleteByPrimaryKey(Integer pid);
    int insert(Permission record);
    int insertSelective(Permission record);
    Permission selectByPrimaryKey(Integer pid);
    int updateByPrimaryKeySelective(Permission record);
    int updateByPrimaryKey(Permission record);
}
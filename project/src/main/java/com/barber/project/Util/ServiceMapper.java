package com.barber.project.Util;

import com.barber.project.Dto.Response.Reservation.ServiceInfo;
import com.barber.project.Entity.SubCategory;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class ServiceMapper {

    public static List<ServiceInfo> mapToServiceInfo(List<SubCategory> services) {
        if (services == null) {
            return Collections.emptyList();
        }

        return services.stream()
                .map(ServiceMapper::mapToServiceInfo)
                .collect(Collectors.toList());
    }

    public static ServiceInfo mapToServiceInfo(SubCategory subCategory) {
        return ServiceInfo.builder()
                .id(subCategory.getId())
                .name(subCategory.getName())
                .duration(subCategory.getDuration())
                .price(subCategory.getPrice())
                .build();
    }
}
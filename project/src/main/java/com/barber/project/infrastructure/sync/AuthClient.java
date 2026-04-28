package com.barber.project.infrastructure.sync;


import com.barber.project.Security.Config.FeignConfig;
import com.barber.project.infrastructure.sync.dto.UserSummaryResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.UUID;

@FeignClient(
        name = "auth-client",
        url = "${auth.server.url}",
        configuration = FeignConfig.class
)
public interface AuthClient {
    @PostMapping("/internal/users/batch")
    List<UserSummaryResponse> getUsersByUuids(@RequestBody List<UUID> uuids);


}

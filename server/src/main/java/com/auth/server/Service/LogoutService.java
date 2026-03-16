package com.auth.server.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.server.authorization.OAuth2Authorization;
import org.springframework.security.oauth2.server.authorization.OAuth2AuthorizationService;
import org.springframework.security.oauth2.server.authorization.OAuth2TokenType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class LogoutService {

    private final OAuth2AuthorizationService auth2AuthorizationService;

    @Transactional
    public void logout(String accessToken){
        OAuth2Authorization oAuth2Authorization = auth2AuthorizationService.findByToken(accessToken, OAuth2TokenType.ACCESS_TOKEN);

        if(oAuth2Authorization!=null){
            auth2AuthorizationService.remove(oAuth2Authorization);
        }
    }
}

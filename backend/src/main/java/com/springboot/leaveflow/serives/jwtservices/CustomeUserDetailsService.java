
package com.springboot.leaveflow.serives.jwtservices;

import com.springboot.leaveflow.entity.Users;
import com.springboot.leaveflow.entity.Active;
import com.springboot.leaveflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomeUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        Users user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new UsernameNotFoundException("Invalid User"));

        return User.withUsername(user.getUsername())
                .password(user.getPassword())
                .roles(user.getRole().name())
                .disabled(user.getActive() == Active.DEACTIVE)
                .build();
    }
}

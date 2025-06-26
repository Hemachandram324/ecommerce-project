// LoginResponse.java (updated to include error message and handle Role enum)
package com.example.ecommerce.payload.response;

import com.example.ecommerce.models.User;
import com.example.ecommerce.models.User.Role;
import com.example.ecommerce.models.User.Status;


public class LoginResponse {
    public LoginResponse(String token, String email, Role role, Status status2) {
    	this.token = token;
      this.email = email;
      this.role = role;
      this.status = status2.toString();
      
	}
	private String token;
    private String email;
    private User.Role role;
    private String status;

    public LoginResponse(String token, String email, User.Role role, String status) {
        this.token = token;
        this.email = email;
        this.role = role;
        this.status = status;
    }

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public User.Role getRole() {
		return role;
	}

	public void setRole(User.Role role) {
		this.role = role;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}
    
}
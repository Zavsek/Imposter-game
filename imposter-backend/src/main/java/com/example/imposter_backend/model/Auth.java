package com.example.imposter_backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "auth")
public class Auth {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name= "email")
    private String email;

    @Column(name="hashed_password")
    private String hashedPassword;

    public Auth (){

    }

    
     public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public String getEmail(){
        return email;
    }
    public void setEmail(String email){
        this.email = email;
    }
    public String getHashedPassword(){
        return hashedPassword;
    }
    public void setHashedPassword(String HashedPassword){
        this.hashedPassword = HashedPassword;
    }


    

}

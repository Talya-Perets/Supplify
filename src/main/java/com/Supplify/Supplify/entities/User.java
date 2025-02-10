package com.Supplify.Supplify.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@RequiredArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "users", schema = "supplifydb")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private int id;

    @Column(name = "first_name", length = 50)
    private String firstName;

    @Column(name = "last_name", length = 50)
    private String lastName;

    @Column(name = "username", nullable = false, unique = true, length = 50)
    @NonNull
    private String username;

    @Column(name = "password")
    private String password;

    @Column(name = "created_at", updatable = false, insertable = false)
    private Date createdAt;

    @Column(name = "updated_at", insertable = false)
    private Date updatedAt;

    @Column(name = "phone", length = 10)
    private String phone;

    @ManyToOne
    @JoinColumn(name = "business_id", nullable = false, foreignKey = @ForeignKey(name = "fk_business"))
    private Business business;

    @ManyToOne
    @JoinColumn(name = "role_id", nullable = false, foreignKey = @ForeignKey(name = "fk_role"))
    private Role role;

    public User(String firstName, String lastName, String username, String password, String phone, Business business, Role role) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.password = password;
        this.phone = phone;
        this.business = business;
        this.role = role;
    }
}

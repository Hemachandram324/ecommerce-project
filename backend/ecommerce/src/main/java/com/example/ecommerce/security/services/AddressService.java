package com.example.ecommerce.security.services;

import com.example.ecommerce.payload.request.AddressRequest;
import com.example.ecommerce.repositories.AddressRepository;
import com.example.ecommerce.models.Address;
import com.example.ecommerce.models.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AddressService {

    private final AddressRepository addressRepository;

    public Address addAddress(AddressRequest dto, User user) {
        Address address = Address.builder()
                .user(user)
                .fullName(dto.getFullName())
                .line1(dto.getLine1())
                .line2(dto.getLine2())
                .city(dto.getCity())
                .state(dto.getState())
                .postalCode(dto.getPostalCode())
                .country(dto.getCountry())
                .phone(dto.getPhone())
                .build();
        return addressRepository.save(address);
    }

    public Address updateAddress(Long id, AddressRequest dto, User user) {
        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Address not found"));
        if (!address.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Cannot modify others' address");
        }
        address.setFullName(dto.getFullName());
        address.setLine1(dto.getLine1());
        address.setLine2(dto.getLine2());
        address.setCity(dto.getCity());
        address.setState(dto.getState());
        address.setPostalCode(dto.getPostalCode());
        address.setCountry(dto.getCountry());
        address.setPhone(dto.getPhone());
        return addressRepository.save(address);
    }

    public String deleteAddress(Long id, User user) {
        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Address not found"));
        if (!address.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Cannot delete others' address");
        }
        addressRepository.delete(address);
        return "Deleted";
    }

    public List<Address> listUserAddresses(User user) {
        return addressRepository.findByUserId(user.getId());
    }
}
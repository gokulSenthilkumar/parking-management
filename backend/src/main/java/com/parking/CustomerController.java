package com.parking;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerRepository customerRepository;
    private final ParkingSessionRepository sessionRepository;

    public CustomerController(CustomerRepository customerRepository, ParkingSessionRepository sessionRepository) {
        this.customerRepository = customerRepository;
        this.sessionRepository = sessionRepository;
    }

    @GetMapping
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    @PostMapping
    public Customer addCustomer(@RequestBody Map<String, String> body) {
        Customer customer = new Customer(
                body.get("name"), body.get("phone"), body.get("vehicleNumber"), body.get("email"));
        return customerRepository.save(customer);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCustomer(@PathVariable Long id) {
        if (!customerRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        boolean hasHistory = sessionRepository.findAll().stream()
                .anyMatch(s -> s.getCustomer() != null && s.getCustomer().getId().equals(id));
        if (hasHistory) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Cannot delete a customer that has parking history"));
        }
        customerRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

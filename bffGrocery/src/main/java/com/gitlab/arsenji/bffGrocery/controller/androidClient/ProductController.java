package com.gitlab.arsenji.bffGrocery.controller.androidClient;
import com.gitlab.arsenji.bffGrocery.dto.ProductDto;
import com.gitlab.arsenji.bffGrocery.railsService.RailsProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {
    private final RailsProductService productService;

    @GetMapping("/{barcode}")
    public ProductDto getProduct(
            @RequestHeader("Authorization") String token,
            @PathVariable("barcode") String barcode
    ){
        return productService.getByBarcode(barcode);
    }

}

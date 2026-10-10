package com.example.techhub_backend.config;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.techhub_backend.model.Product;
import com.example.techhub_backend.model.Role;
import com.example.techhub_backend.model.User;
import com.example.techhub_backend.repository.ProductRepository;
import com.example.techhub_backend.repository.UserRepository;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initializeData(
            UserRepository userRepository,
            ProductRepository productRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            // Keep the default employee account.
            String employeeEmail = "employee@techhub.com";

            if (!userRepository.existsByEmail(employeeEmail)) {
                User employee = new User(
                        "TechHUB Employee",
                        employeeEmail,
                        passwordEncoder.encode("employee123"),
                        Role.EMPLOYEE
                );

                userRepository.save(employee);

                System.out.println("====================================");
                System.out.println("Default TechHUB employee created");
                System.out.println("Email: employee@techhub.com");
                System.out.println("Password: employee123");
                System.out.println("Role: EMPLOYEE");
                System.out.println("====================================");
            }

            // ------------------------------------------------------------
            // PRODUCT CATALOG
            // Last value on each line = image path (or a full link).
            // Brand, description and specs come from the DETAILS table below.
            // ------------------------------------------------------------
            List<Product> catalog = List.of(
                    // Gaming Laptops
                    product("ASUS ROG Strix SCAR 18 (RTX 5090)", 450000, 5, "Gaming Laptop", "/images/products/asus-rog-strix-scar-18-rtx-5090.jpg"),
                    product("ASUS ROG Zephyrus G16 (2026)", 260000, 6, "Gaming Laptop", "/images/products/asus-rog-zephyrus-g16-2026.jpg"),
                    product("ASUS ROG Zephyrus G14 (2026)", 235000, 6, "Gaming Laptop", "/images/products/asus-rog-zephyrus-g14-2026.jpg"),
                    product("Lenovo Legion Pro 7i Gen 10 (RTX 5080)", 340000, 5, "Gaming Laptop", "/images/products/lenovo-legion-pro-7i-gen-10-rtx-5080.jpg"),
                    product("MSI Raider 16 Max HX", 425000, 5, "Gaming Laptop", "/images/products/msi-raider-16-max-hx.jpg"),
                    product("MSI Stealth 16 AI+", 340000, 6, "Gaming Laptop", "/images/products/msi-stealth-16-ai.jpg"),
                    product("Acer Predator Helios 18 AI", 375000, 5, "Gaming Laptop", "/images/products/acer-predator-helios-18-ai.jpg"),
                    product("Acer Nitro V16 (RTX 5070)", 130000, 8, "Gaming Laptop", "/images/products/acer-nitro-v16-rtx-5070.jpg"),
                    product("ASUS TUF Gaming A16 (RTX 5060)", 125000, 8, "Gaming Laptop", "/images/products/asus-tuf-gaming-a16-rtx-5060.jpg"),
                    product("HyperX OMEN 16", 165000, 8, "Gaming Laptop", "/images/products/hyperx-omen-16.jpg"),

                    // Office / Thin-and-Light
                    product("Apple MacBook Air M4", 112450, 8, "Office Laptop", "/images/products/apple-macbook-air-m4.jpg"),
                    product("MSI Prestige 16 AI Evo", 140000, 7, "Office Laptop", "/images/products/msi-prestige-16-ai-evo.jpg"),
                    product("Lenovo ThinkPad X1 Carbon", 200000, 6, "Office Laptop", "/images/products/lenovo-thinkpad-x1-carbon.jpg"),
                    product("Dell XPS 14", 220000, 6, "Office Laptop", "/images/products/dell-xps-14.jpg"),
                    product("HP EliteBook (range)", 130000, 8, "Office Laptop", "/images/products/hp-elitebook-range.jpg"),
                    product("MSI Modern 14S", 55000, 10, "Office Laptop", "/images/products/msi-modern-14s.jpg"),

                    // Prebuilt PCs
                    product("Gaming PC: Ryzen 7 9800X3D + RTX 5070 Ti", 210000, 5, "PC", "/images/products/gaming-pc-ryzen-7-9800x3d-rtx-5070-ti.jpg"),
                    product("Gaming PC: Ryzen 5 9600X + RTX 5060 Ti", 107500, 7, "PC", "/images/products/gaming-pc-ryzen-5-9600x-rtx-5060-ti.jpg"),
                    product("Gaming PC: Core Ultra 7 265K + RTX 5070", 145000, 6, "PC", "/images/products/gaming-pc-core-ultra-7-265k-rtx-5070.jpg"),
                    product("Apple Mac mini M4", 74950, 8, "PC", "/images/products/apple-mac-mini-m4.jpg"),
                    product("Lenovo ThinkCentre Neo", 57500, 8, "PC", "/images/products/lenovo-thinkcentre-neo.jpg"),
                    product("Dell OptiPlex Micro", 72500, 8, "PC", "/images/products/dell-optiplex-micro.jpg"),

                    // Graphics Cards
                    product("NVIDIA RTX 5090", 380000, 4, "Components", "/images/products/nvidia-rtx-5090.jpg"),
                    product("NVIDIA RTX 5080", 142500, 5, "Components", "/images/products/nvidia-rtx-5080.jpg"),
                    product("NVIDIA RTX 5070 Ti", 85500, 7, "Components", "/images/products/nvidia-rtx-5070-ti.jpg"),
                    product("NVIDIA RTX 5060 Ti", 52500, 8, "Components", "/images/products/nvidia-rtx-5060-ti.jpg"),
                    product("AMD Radeon RX 9070 XT", 77500, 7, "Components", "/images/products/amd-radeon-rx-9070-xt.jpg"),
                    product("Intel Arc B580", 29000, 10, "Components", "/images/products/intel-arc-b580.jpg"),

                    // Processors
                    product("AMD Ryzen 9 9950X3D", 73000, 6, "Components", "/images/products/amd-ryzen-9-9950x3d.jpg"),
                    product("AMD Ryzen 7 9800X3D", 53000, 7, "Components", "/images/products/amd-ryzen-7-9800x3d.jpg"),
                    product("AMD Ryzen 5 9600X", 24000, 10, "Components", "/images/products/amd-ryzen-5-9600x.jpg"),
                    product("Intel Core Ultra 9 285K", 58500, 6, "Components", "/images/products/intel-core-ultra-9-285k.jpg"),
                    product("Intel Core Ultra 7 265K", 36500, 8, "Components", "/images/products/intel-core-ultra-7-265k.jpg"),

                    // Motherboards, memory, storage, power, cooling and cases
                    product("ASUS ROG Strix X870E-E", 47000, 6, "Components", "/images/products/asus-rog-strix-x870e-e.jpg"),
                    product("MSI MAG B850 Tomahawk", 23000, 8, "Components", "/images/products/msi-mag-b850-tomahawk.jpg"),
                    product("Corsair Vengeance DDR5 32GB 6000MHz", 18500, 10, "Components", "/images/products/corsair-vengeance-ddr5-32gb-6000mhz.jpg"),
                    product("Samsung 990 Pro 1TB", 13500, 12, "Components", "/images/products/samsung-990-pro-1tb.jpg"),
                    product("Crucial T705 1TB (Gen5)", 19000, 10, "Components", "/images/products/crucial-t705-1tb-gen5.jpg"),
                    product("Corsair RM1000x PSU", 17000, 8, "Components", "/images/products/corsair-rm1000x-psu.jpg"),
                    product("Arctic Liquid Freezer III 360", 10500, 10, "Components", "/images/products/arctic-liquid-freezer-iii-360.jpg"),
                    product("Lian Li O11 Dynamic EVO", 15000, 8, "Components", "/images/products/lian-li-o11-dynamic-evo.jpg"),

                    // Monitors
                    product("ASUS ROG Swift OLED PG27AQDM", 70000, 6, "Accessories", "/images/products/asus-rog-swift-oled-pg27aqdm.jpg"),
                    product("LG UltraGear OLED 27GR95QE", 65000, 6, "Accessories", "/images/products/lg-ultragear-oled-27gr95qe.jpg"),
                    product("Samsung Odyssey OLED G8", 95000, 5, "Accessories", "/images/products/samsung-odyssey-oled-g8.jpg"),

                    // Peripherals and handhelds
                    product("Logitech G Pro X Superlight 2", 15500, 10, "Accessories", "/images/products/logitech-g-pro-x-superlight-2.jpg"),
                    product("Razer Huntsman V3 Pro", 21500, 8, "Accessories", "/images/products/razer-huntsman-v3-pro.jpg"),
                    product("SteelSeries Arctis Nova Pro Wireless", 34000, 7, "Accessories", "/images/products/steelseries-arctis-nova-pro-wireless.jpg"),
                    product("HyperX Cloud III", 8250, 12, "Accessories", "/images/products/hyperx-cloud-iii.jpg"),
                    product("Logitech MX Master 3S", 9500, 12, "Accessories", "/images/products/logitech-mx-master-3s.jpg"),
                    product("MSI Claw 8 AI+", 95000, 6, "Accessories", "/images/products/msi-claw-8-ai.jpg")
            );

            boolean newCatalogExists =
                    productRepository.findByCategory("Gaming Laptop")
                            .stream()
                            .anyMatch(p -> p.getName().equals("ASUS ROG Strix SCAR 18 (RTX 5090)"));

            if (!newCatalogExists) {
                // First run: replace the old catalog with the new one.
                productRepository.deleteAll();
                productRepository.flush();

                productRepository.saveAll(catalog);

                System.out.println("====================================");
                System.out.println("TechHUB product catalog replaced");
                System.out.println(catalog.size() + " new products added");
                System.out.println("====================================");

            } else {
                // Catalog already in the database: fill in image, brand,
                // description and specs where they are missing or changed.
                Map<String, Product> catalogByName = new HashMap<>();
                for (Product item : catalog) {
                    catalogByName.put(item.getName(), item);
                }

                int updated = 0;

                for (Product existing : productRepository.findAll()) {

                    Product fromCatalog = catalogByName.get(existing.getName());

                    if (fromCatalog == null) {
                        continue;
                    }

                    boolean changed = false;

                    String newImage = fromCatalog.getImage();
                    if (newImage != null && !newImage.isBlank()
                            && !newImage.equals(existing.getImage())) {
                        existing.setImage(newImage);
                        changed = true;
                    }

                    if (isBlank(existing.getBrand())) {
                        existing.setBrand(fromCatalog.getBrand());
                        changed = true;
                    }

                    if (isBlank(existing.getDescription())) {
                        existing.setDescription(fromCatalog.getDescription());
                        changed = true;
                    }

                    if (isBlank(existing.getSpecs())) {
                        existing.setSpecs(fromCatalog.getSpecs());
                        changed = true;
                    }

                    if (changed) {
                        productRepository.save(existing);
                        updated++;
                    }
                }

                System.out.println("====================================");
                System.out.println("Products updated: " + updated);
                System.out.println("====================================");
            }
        };
    }

    // name -> { brand, kind of product, specs separated by | }
    private static final Map<String, String[]> DETAILS = Map.ofEntries(
            Map.entry("ASUS ROG Strix SCAR 18 (RTX 5090)", new String[] {"ASUS", "gaming laptop", "NVIDIA GeForce RTX 5090 graphics|18-inch display|ROG Strix SCAR series|Built for high-end gaming"}),
            Map.entry("ASUS ROG Zephyrus G16 (2026)", new String[] {"ASUS", "gaming laptop", "16-inch display|ROG Zephyrus series|2026 model|Slim gaming design"}),
            Map.entry("ASUS ROG Zephyrus G14 (2026)", new String[] {"ASUS", "gaming laptop", "14-inch display|ROG Zephyrus series|2026 model|Compact gaming design"}),
            Map.entry("Lenovo Legion Pro 7i Gen 10 (RTX 5080)", new String[] {"Lenovo", "gaming laptop", "NVIDIA GeForce RTX 5080 graphics|Legion Pro 7i series|Gen 10 model|Built for high-performance gaming"}),
            Map.entry("MSI Raider 16 Max HX", new String[] {"MSI", "gaming laptop", "16-inch display|HX-series high-performance processor|Raider series|Built for high-end gaming"}),
            Map.entry("MSI Stealth 16 AI+", new String[] {"MSI", "gaming laptop", "16-inch display|AI+ model|Stealth series|Slim gaming design"}),
            Map.entry("Acer Predator Helios 18 AI", new String[] {"Acer", "gaming laptop", "18-inch display|AI-ready model|Predator Helios series|Built for high-end gaming"}),
            Map.entry("Acer Nitro V16 (RTX 5070)", new String[] {"Acer", "gaming laptop", "NVIDIA GeForce RTX 5070 graphics|16-inch display|Nitro V series|Great value for gaming"}),
            Map.entry("ASUS TUF Gaming A16 (RTX 5060)", new String[] {"ASUS", "gaming laptop", "NVIDIA GeForce RTX 5060 graphics|16-inch display|TUF Gaming series|Durable gaming design"}),
            Map.entry("HyperX OMEN 16", new String[] {"HyperX", "gaming laptop", "16-inch display|OMEN series|Built for gaming and creative work"}),
            Map.entry("Apple MacBook Air M4", new String[] {"Apple", "thin-and-light laptop", "Apple M4 chip|macOS|Thin and light design|Fanless design"}),
            Map.entry("MSI Prestige 16 AI Evo", new String[] {"MSI", "thin-and-light laptop", "16-inch display|Intel Evo platform|AI-ready model|Thin and light design"}),
            Map.entry("Lenovo ThinkPad X1 Carbon", new String[] {"Lenovo", "business laptop", "ThinkPad X1 series|Carbon-fibre ultralight design|Built for professionals"}),
            Map.entry("Dell XPS 14", new String[] {"Dell", "premium laptop", "14-inch display|XPS series|Premium thin design"}),
            Map.entry("HP EliteBook (range)", new String[] {"HP", "business laptop", "EliteBook series|Business-focused features|Built for professionals"}),
            Map.entry("MSI Modern 14S", new String[] {"MSI", "everyday laptop", "14-inch display|Modern series|Everyday productivity"}),
            Map.entry("Gaming PC: Ryzen 7 9800X3D + RTX 5070 Ti", new String[] {"TechHUB", "prebuilt gaming PC", "AMD Ryzen 7 9800X3D processor|NVIDIA GeForce RTX 5070 Ti graphics|Prebuilt gaming desktop"}),
            Map.entry("Gaming PC: Ryzen 5 9600X + RTX 5060 Ti", new String[] {"TechHUB", "prebuilt gaming PC", "AMD Ryzen 5 9600X processor|NVIDIA GeForce RTX 5060 Ti graphics|Prebuilt gaming desktop"}),
            Map.entry("Gaming PC: Core Ultra 7 265K + RTX 5070", new String[] {"TechHUB", "prebuilt gaming PC", "Intel Core Ultra 7 265K processor|NVIDIA GeForce RTX 5070 graphics|Prebuilt gaming desktop"}),
            Map.entry("Apple Mac mini M4", new String[] {"Apple", "compact desktop PC", "Apple M4 chip|macOS|Compact desktop design"}),
            Map.entry("Lenovo ThinkCentre Neo", new String[] {"Lenovo", "business desktop PC", "ThinkCentre Neo series|Built for office use"}),
            Map.entry("Dell OptiPlex Micro", new String[] {"Dell", "business desktop PC", "Micro form factor|OptiPlex series|Space-saving design"}),
            Map.entry("NVIDIA RTX 5090", new String[] {"NVIDIA", "graphics card", "NVIDIA GeForce RTX 5090|Desktop graphics card|Flagship performance"}),
            Map.entry("NVIDIA RTX 5080", new String[] {"NVIDIA", "graphics card", "NVIDIA GeForce RTX 5080|Desktop graphics card|High-end performance"}),
            Map.entry("NVIDIA RTX 5070 Ti", new String[] {"NVIDIA", "graphics card", "NVIDIA GeForce RTX 5070 Ti|Desktop graphics card|Strong performance for gaming"}),
            Map.entry("NVIDIA RTX 5060 Ti", new String[] {"NVIDIA", "graphics card", "NVIDIA GeForce RTX 5060 Ti|Desktop graphics card|Great value for gaming"}),
            Map.entry("AMD Radeon RX 9070 XT", new String[] {"AMD", "graphics card", "AMD Radeon RX 9070 XT|Desktop graphics card|High-end performance"}),
            Map.entry("Intel Arc B580", new String[] {"Intel", "graphics card", "Intel Arc B580|Desktop graphics card|Budget-friendly gaming"}),
            Map.entry("AMD Ryzen 9 9950X3D", new String[] {"AMD", "desktop processor", "AMD Ryzen 9 9950X3D|X3D gaming cache technology|Desktop processor"}),
            Map.entry("AMD Ryzen 7 9800X3D", new String[] {"AMD", "desktop processor", "AMD Ryzen 7 9800X3D|X3D gaming cache technology|Desktop processor"}),
            Map.entry("AMD Ryzen 5 9600X", new String[] {"AMD", "desktop processor", "AMD Ryzen 5 9600X|Desktop processor|Great value for gaming"}),
            Map.entry("Intel Core Ultra 9 285K", new String[] {"Intel", "desktop processor", "Intel Core Ultra 9 285K|Unlocked K-series|Desktop processor"}),
            Map.entry("Intel Core Ultra 7 265K", new String[] {"Intel", "desktop processor", "Intel Core Ultra 7 265K|Unlocked K-series|Desktop processor"}),
            Map.entry("ASUS ROG Strix X870E-E", new String[] {"ASUS", "motherboard", "AMD X870E chipset|ROG Strix series|Motherboard for Ryzen processors"}),
            Map.entry("MSI MAG B850 Tomahawk", new String[] {"MSI", "motherboard", "AMD B850 chipset|MAG Tomahawk series|Motherboard for Ryzen processors"}),
            Map.entry("Corsair Vengeance DDR5 32GB 6000MHz", new String[] {"Corsair", "DDR5 memory kit", "32GB capacity|DDR5 memory|6000MHz speed|Vengeance series"}),
            Map.entry("Samsung 990 Pro 1TB", new String[] {"Samsung", "NVMe SSD", "1TB capacity|NVMe SSD|990 Pro series"}),
            Map.entry("Crucial T705 1TB (Gen5)", new String[] {"Crucial", "NVMe SSD", "1TB capacity|PCIe Gen5 NVMe SSD|T705 series"}),
            Map.entry("Corsair RM1000x PSU", new String[] {"Corsair", "power supply", "1000W power output|RMx series|Fully modular design"}),
            Map.entry("Arctic Liquid Freezer III 360", new String[] {"Arctic", "liquid CPU cooler", "360mm radiator|All-in-one liquid cooler|Liquid Freezer III series"}),
            Map.entry("Lian Li O11 Dynamic EVO", new String[] {"Lian Li", "PC case", "Tempered glass PC case|O11 Dynamic EVO series|Dual-chamber layout"}),
            Map.entry("ASUS ROG Swift OLED PG27AQDM", new String[] {"ASUS", "gaming monitor", "27-inch display|OLED panel|QHD resolution|ROG Swift series"}),
            Map.entry("LG UltraGear OLED 27GR95QE", new String[] {"LG", "gaming monitor", "27-inch display|OLED panel|UltraGear series"}),
            Map.entry("Samsung Odyssey OLED G8", new String[] {"Samsung", "gaming monitor", "OLED panel|Odyssey G8 series|Gaming display"}),
            Map.entry("Logitech G Pro X Superlight 2", new String[] {"Logitech", "wireless gaming mouse", "Wireless connection|Ultra-lightweight design|G Pro X series"}),
            Map.entry("Razer Huntsman V3 Pro", new String[] {"Razer", "gaming keyboard", "Analog optical switches|Huntsman V3 Pro series|Gaming keyboard"}),
            Map.entry("SteelSeries Arctis Nova Pro Wireless", new String[] {"SteelSeries", "wireless gaming headset", "Wireless connection|Arctis Nova Pro series|Gaming headset"}),
            Map.entry("HyperX Cloud III", new String[] {"HyperX", "gaming headset", "Cloud III series|Comfort-focused design|Gaming headset"}),
            Map.entry("Logitech MX Master 3S", new String[] {"Logitech", "wireless mouse", "Wireless connection|Ergonomic design|Built for productivity"}),
            Map.entry("MSI Claw 8 AI+", new String[] {"MSI", "handheld gaming PC", "8-inch display|AI+ model|Handheld gaming PC"})
    );

    private static boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private static Product product(
            String name,
            double price,
            int stock,
            String category,
            String image) {

        Product product = new Product(
                name,
                price,
                stock,
                category,
                image
        );

        String[] details = DETAILS.get(name);

        if (details != null) {
            product.setBrand(details[0]);
            product.setDescription(
                    name + " is a " + details[1] + " from " + details[0]
                            + ". See the details below for the key features."
            );
            product.setSpecs(details[2]);
        }

        return product;
    }
}

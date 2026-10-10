-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: techhub
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `price` double NOT NULL,
  `product_id` int NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `quantity` int NOT NULL,
  `order_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKbioxgbv59vetrxe0ejfubep1w` (`order_id`),
  CONSTRAINT `FKbioxgbv59vetrxe0ejfubep1w` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,80000,3,'Gaming Laptop',1,1),(2,80000,3,'Gaming Laptop',1,2),(3,80000,3,'Gaming Laptop',1,3),(4,120000,6,'Custom PC',2,4),(5,80000,3,'Gaming Laptop',1,5),(6,80000,3,'Gaming Laptop',1,6),(7,80000,3,'Gaming Laptop',1,7);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `order_date` datetime(6) NOT NULL,
  `shipping_address` varchar(500) NOT NULL,
  `status` enum('CANCELLED','CONFIRMED','DELIVERED','PENDING','SHIPPED') NOT NULL,
  `total_amount` double NOT NULL,
  `user_id` bigint NOT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `payment_status` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK32ql8ubntj5uh44ph9659tiih` (`user_id`),
  CONSTRAINT `FK32ql8ubntj5uh44ph9659tiih` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,'2026-10-03 15:28:06.871760','Mumbai, Maharashtra, India','DELIVERED',80000,2,NULL,NULL),(2,'2026-10-03 15:34:41.625717','Mumbai, Maharashtra, India','DELIVERED',80000,2,NULL,NULL),(3,'2026-10-03 15:42:16.966056','Mumbai, Maharashtra, India','DELIVERED',80000,2,NULL,NULL),(4,'2026-10-03 16:08:39.877915','shbsssbi sxui huixhuis hxui hasuix hui hxuih , mumbai, maharashtra - 789456','DELIVERED',240000,3,NULL,NULL),(5,'2026-10-04 00:45:15.334097','ffsdf ghf gh, mumbai, maharashtra - 874521','DELIVERED',80000,3,NULL,NULL),(6,'2026-10-04 00:49:31.471019','guyfi kgljkbdk ehdiu gkg iusgc isj ciu g, mumbai, maharashtra - 875421','PENDING',80000,3,NULL,NULL),(7,'2026-10-06 01:01:21.862566',' g gujkvh  gupivkb [h vikj bi[hmgvkjb i[huvhkjb [p, fhbnmkjh, ergfsvdafgrhsg - 985623','PENDING',80000,3,NULL,NULL);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `price` double NOT NULL,
  `stock` int NOT NULL,
  `image` varchar(1000) DEFAULT NULL,
  `brand` varchar(100) DEFAULT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `specs` varchar(2000) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (15,'Gaming Laptop','ASUS ROG Strix SCAR 18 (RTX 5090)',450000,5,'/images/products/asus-rog-strix-scar-18-rtx-5090.jpg','ASUS','ASUS ROG Strix SCAR 18 (RTX 5090) is a gaming laptop from ASUS. See the details below for the key features.','NVIDIA GeForce RTX 5090 graphics|18-inch display|ROG Strix SCAR series|Built for high-end gaming'),(16,'Gaming Laptop','ASUS ROG Zephyrus G16 (2026)',260000,6,'/images/products/asus-rog-zephyrus-g16-2026.jpg','ASUS','ASUS ROG Zephyrus G16 (2026) is a gaming laptop from ASUS. See the details below for the key features.','16-inch display|ROG Zephyrus series|2026 model|Slim gaming design'),(17,'Gaming Laptop','ASUS ROG Zephyrus G14 (2026)',235000,6,'/images/products/asus-rog-zephyrus-g14-2026.jpg','ASUS','ASUS ROG Zephyrus G14 (2026) is a gaming laptop from ASUS. See the details below for the key features.','14-inch display|ROG Zephyrus series|2026 model|Compact gaming design'),(18,'Gaming Laptop','Lenovo Legion Pro 7i Gen 10 (RTX 5080)',340000,5,'/images/products/lenovo-legion-pro-7i-gen-10-rtx-5080.jpg','Lenovo','Lenovo Legion Pro 7i Gen 10 (RTX 5080) is a gaming laptop from Lenovo. See the details below for the key features.','NVIDIA GeForce RTX 5080 graphics|Legion Pro 7i series|Gen 10 model|Built for high-performance gaming'),(19,'Gaming Laptop','MSI Raider 16 Max HX',425000,5,'/images/products/msi-raider-16-max-hx.jpg','MSI','MSI Raider 16 Max HX is a gaming laptop from MSI. See the details below for the key features.','16-inch display|HX-series high-performance processor|Raider series|Built for high-end gaming'),(20,'Gaming Laptop','MSI Stealth 16 AI+',340000,6,'/images/products/msi-stealth-16-ai.jpg','MSI','MSI Stealth 16 AI+ is a gaming laptop from MSI. See the details below for the key features.','16-inch display|AI+ model|Stealth series|Slim gaming design'),(21,'Gaming Laptop','Acer Predator Helios 18 AI',375000,5,'/images/products/acer-predator-helios-18-ai.jpg','Acer','Acer Predator Helios 18 AI is a gaming laptop from Acer. See the details below for the key features.','18-inch display|AI-ready model|Predator Helios series|Built for high-end gaming'),(22,'Gaming Laptop','Acer Nitro V16 (RTX 5070)',130000,8,'/images/products/acer-nitro-v16-rtx-5070.jpg','Acer','Acer Nitro V16 (RTX 5070) is a gaming laptop from Acer. See the details below for the key features.','NVIDIA GeForce RTX 5070 graphics|16-inch display|Nitro V series|Great value for gaming'),(23,'Gaming Laptop','ASUS TUF Gaming A16 (RTX 5060)',125000,8,'/images/products/asus-tuf-gaming-a16-rtx-5060.jpg','ASUS','ASUS TUF Gaming A16 (RTX 5060) is a gaming laptop from ASUS. See the details below for the key features.','NVIDIA GeForce RTX 5060 graphics|16-inch display|TUF Gaming series|Durable gaming design'),(24,'Gaming Laptop','HyperX OMEN 16',165000,8,'/images/products/hyperx-omen-16.jpg','HyperX','HyperX OMEN 16 is a gaming laptop from HyperX. See the details below for the key features.','16-inch display|OMEN series|Built for gaming and creative work'),(25,'Office Laptop','Apple MacBook Air M4',112450,8,'/images/products/apple-macbook-air-m4.jpg','Apple','Apple MacBook Air M4 is a thin-and-light laptop from Apple. See the details below for the key features.','Apple M4 chip|macOS|Thin and light design|Fanless design'),(26,'Office Laptop','MSI Prestige 16 AI Evo',140000,7,'/images/products/msi-prestige-16-ai-evo.jpg','MSI','MSI Prestige 16 AI Evo is a thin-and-light laptop from MSI. See the details below for the key features.','16-inch display|Intel Evo platform|AI-ready model|Thin and light design'),(27,'Office Laptop','Lenovo ThinkPad X1 Carbon',200000,6,'/images/products/lenovo-thinkpad-x1-carbon.jpg','Lenovo','Lenovo ThinkPad X1 Carbon is a business laptop from Lenovo. See the details below for the key features.','ThinkPad X1 series|Carbon-fibre ultralight design|Built for professionals'),(28,'Office Laptop','Dell XPS 14',220000,6,'/images/products/dell-xps-14.jpg','Dell','Dell XPS 14 is a premium laptop from Dell. See the details below for the key features.','14-inch display|XPS series|Premium thin design'),(29,'Office Laptop','HP EliteBook (range)',130000,8,'/images/products/hp-elitebook-range.jpg','HP','HP EliteBook (range) is a business laptop from HP. See the details below for the key features.','EliteBook series|Business-focused features|Built for professionals'),(30,'Office Laptop','MSI Modern 14S',55000,10,'/images/products/msi-modern-14s.jpg','MSI','MSI Modern 14S is a everyday laptop from MSI. See the details below for the key features.','14-inch display|Modern series|Everyday productivity'),(31,'PC','Gaming PC: Ryzen 7 9800X3D + RTX 5070 Ti',210000,5,'/images/products/gaming-pc-ryzen-7-9800x3d-rtx-5070-ti.jpg','TechHUB','Gaming PC: Ryzen 7 9800X3D + RTX 5070 Ti is a prebuilt gaming PC from TechHUB. See the details below for the key features.','AMD Ryzen 7 9800X3D processor|NVIDIA GeForce RTX 5070 Ti graphics|Prebuilt gaming desktop'),(32,'PC','Gaming PC: Ryzen 5 9600X + RTX 5060 Ti',107500,7,'/images/products/gaming-pc-ryzen-5-9600x-rtx-5060-ti.jpg','TechHUB','Gaming PC: Ryzen 5 9600X + RTX 5060 Ti is a prebuilt gaming PC from TechHUB. See the details below for the key features.','AMD Ryzen 5 9600X processor|NVIDIA GeForce RTX 5060 Ti graphics|Prebuilt gaming desktop'),(33,'PC','Gaming PC: Core Ultra 7 265K + RTX 5070',145000,6,'/images/products/gaming-pc-core-ultra-7-265k-rtx-5070.jpg','TechHUB','Gaming PC: Core Ultra 7 265K + RTX 5070 is a prebuilt gaming PC from TechHUB. See the details below for the key features.','Intel Core Ultra 7 265K processor|NVIDIA GeForce RTX 5070 graphics|Prebuilt gaming desktop'),(34,'PC','Apple Mac mini M4',74950,8,'/images/products/apple-mac-mini-m4.jpg','Apple','Apple Mac mini M4 is a compact desktop PC from Apple. See the details below for the key features.','Apple M4 chip|macOS|Compact desktop design'),(35,'PC','Lenovo ThinkCentre Neo',57500,8,'/images/products/lenovo-thinkcentre-neo.jpg','Lenovo','Lenovo ThinkCentre Neo is a business desktop PC from Lenovo. See the details below for the key features.','ThinkCentre Neo series|Built for office use'),(36,'PC','Dell OptiPlex Micro',72500,8,'/images/products/dell-optiplex-micro.jpg','Dell','Dell OptiPlex Micro is a business desktop PC from Dell. See the details below for the key features.','Micro form factor|OptiPlex series|Space-saving design'),(37,'Components','NVIDIA RTX 5090',380000,4,'/images/products/nvidia-rtx-5090.jpg','NVIDIA','NVIDIA RTX 5090 is a graphics card from NVIDIA. See the details below for the key features.','NVIDIA GeForce RTX 5090|Desktop graphics card|Flagship performance'),(38,'Components','NVIDIA RTX 5080',142500,5,'/images/products/nvidia-rtx-5080.jpg','NVIDIA','NVIDIA RTX 5080 is a graphics card from NVIDIA. See the details below for the key features.','NVIDIA GeForce RTX 5080|Desktop graphics card|High-end performance'),(39,'Components','NVIDIA RTX 5070 Ti',85500,7,'/images/products/nvidia-rtx-5070-ti.jpg','NVIDIA','NVIDIA RTX 5070 Ti is a graphics card from NVIDIA. See the details below for the key features.','NVIDIA GeForce RTX 5070 Ti|Desktop graphics card|Strong performance for gaming'),(40,'Components','NVIDIA RTX 5060 Ti',52500,8,'/images/products/nvidia-rtx-5060-ti.jpg','NVIDIA','NVIDIA RTX 5060 Ti is a graphics card from NVIDIA. See the details below for the key features.','NVIDIA GeForce RTX 5060 Ti|Desktop graphics card|Great value for gaming'),(41,'Components','AMD Radeon RX 9070 XT',77500,7,'/images/products/amd-radeon-rx-9070-xt.jpg','AMD','AMD Radeon RX 9070 XT is a graphics card from AMD. See the details below for the key features.','AMD Radeon RX 9070 XT|Desktop graphics card|High-end performance'),(42,'Components','Intel Arc B580',29000,10,'/images/products/intel-arc-b580.jpg','Intel','Intel Arc B580 is a graphics card from Intel. See the details below for the key features.','Intel Arc B580|Desktop graphics card|Budget-friendly gaming'),(43,'Components','AMD Ryzen 9 9950X3D',73000,6,'/images/products/amd-ryzen-9-9950x3d.jpg','AMD','AMD Ryzen 9 9950X3D is a desktop processor from AMD. See the details below for the key features.','AMD Ryzen 9 9950X3D|X3D gaming cache technology|Desktop processor'),(44,'Components','AMD Ryzen 7 9800X3D',53000,7,'/images/products/amd-ryzen-7-9800x3d.jpg','AMD','AMD Ryzen 7 9800X3D is a desktop processor from AMD. See the details below for the key features.','AMD Ryzen 7 9800X3D|X3D gaming cache technology|Desktop processor'),(45,'Components','AMD Ryzen 5 9600X',24000,10,'/images/products/amd-ryzen-5-9600x.jpg','AMD','AMD Ryzen 5 9600X is a desktop processor from AMD. See the details below for the key features.','AMD Ryzen 5 9600X|Desktop processor|Great value for gaming'),(46,'Components','Intel Core Ultra 9 285K',58500,6,'/images/products/intel-core-ultra-9-285k.jpg','Intel','Intel Core Ultra 9 285K is a desktop processor from Intel. See the details below for the key features.','Intel Core Ultra 9 285K|Unlocked K-series|Desktop processor'),(47,'Components','Intel Core Ultra 7 265K',36500,8,'/images/products/intel-core-ultra-7-265k.jpg','Intel','Intel Core Ultra 7 265K is a desktop processor from Intel. See the details below for the key features.','Intel Core Ultra 7 265K|Unlocked K-series|Desktop processor'),(48,'Components','ASUS ROG Strix X870E-E',47000,6,'/images/products/asus-rog-strix-x870e-e.jpg','ASUS','ASUS ROG Strix X870E-E is a motherboard from ASUS. See the details below for the key features.','AMD X870E chipset|ROG Strix series|Motherboard for Ryzen processors'),(49,'Components','MSI MAG B850 Tomahawk',23000,8,'/images/products/msi-mag-b850-tomahawk.jpg','MSI','MSI MAG B850 Tomahawk is a motherboard from MSI. See the details below for the key features.','AMD B850 chipset|MAG Tomahawk series|Motherboard for Ryzen processors'),(50,'Components','Corsair Vengeance DDR5 32GB 6000MHz',18500,10,'/images/products/corsair-vengeance-ddr5-32gb-6000mhz.jpg','Corsair','Corsair Vengeance DDR5 32GB 6000MHz is a DDR5 memory kit from Corsair. See the details below for the key features.','32GB capacity|DDR5 memory|6000MHz speed|Vengeance series'),(51,'Components','Samsung 990 Pro 1TB',13500,12,'/images/products/samsung-990-pro-1tb.jpg','Samsung','Samsung 990 Pro 1TB is a NVMe SSD from Samsung. See the details below for the key features.','1TB capacity|NVMe SSD|990 Pro series'),(52,'Components','Crucial T705 1TB (Gen5)',19000,10,'/images/products/crucial-t705-1tb-gen5.jpg','Crucial','Crucial T705 1TB (Gen5) is a NVMe SSD from Crucial. See the details below for the key features.','1TB capacity|PCIe Gen5 NVMe SSD|T705 series'),(53,'Components','Corsair RM1000x PSU',17000,8,'/images/products/corsair-rm1000x-psu.jpg','Corsair','Corsair RM1000x PSU is a power supply from Corsair. See the details below for the key features.','1000W power output|RMx series|Fully modular design'),(54,'Components','Arctic Liquid Freezer III 360',10500,10,'/images/products/arctic-liquid-freezer-iii-360.jpg','Arctic','Arctic Liquid Freezer III 360 is a liquid CPU cooler from Arctic. See the details below for the key features.','360mm radiator|All-in-one liquid cooler|Liquid Freezer III series'),(55,'Components','Lian Li O11 Dynamic EVO',15000,8,'/images/products/lian-li-o11-dynamic-evo.jpg','Lian Li','Lian Li O11 Dynamic EVO is a PC case from Lian Li. See the details below for the key features.','Tempered glass PC case|O11 Dynamic EVO series|Dual-chamber layout'),(56,'Accessories','ASUS ROG Swift OLED PG27AQDM',70000,6,'/images/products/asus-rog-swift-oled-pg27aqdm.jpg','ASUS','ASUS ROG Swift OLED PG27AQDM is a gaming monitor from ASUS. See the details below for the key features.','27-inch display|OLED panel|QHD resolution|ROG Swift series'),(57,'Accessories','LG UltraGear OLED 27GR95QE',65000,6,'/images/products/lg-ultragear-oled-27gr95qe.jpg','LG','LG UltraGear OLED 27GR95QE is a gaming monitor from LG. See the details below for the key features.','27-inch display|OLED panel|UltraGear series'),(58,'Accessories','Samsung Odyssey OLED G8',95000,5,'/images/products/samsung-odyssey-oled-g8.jpg','Samsung','Samsung Odyssey OLED G8 is a gaming monitor from Samsung. See the details below for the key features.','OLED panel|Odyssey G8 series|Gaming display'),(59,'Accessories','Logitech G Pro X Superlight 2',15500,10,'/images/products/logitech-g-pro-x-superlight-2.jpg','Logitech','Logitech G Pro X Superlight 2 is a wireless gaming mouse from Logitech. See the details below for the key features.','Wireless connection|Ultra-lightweight design|G Pro X series'),(60,'Accessories','Razer Huntsman V3 Pro',21500,8,'/images/products/razer-huntsman-v3-pro.jpg','Razer','Razer Huntsman V3 Pro is a gaming keyboard from Razer. See the details below for the key features.','Analog optical switches|Huntsman V3 Pro series|Gaming keyboard'),(61,'Accessories','SteelSeries Arctis Nova Pro Wireless',34000,9,'/images/products/steelseries-arctis-nova-pro-wireless.jpg','SteelSeries','SteelSeries Arctis Nova Pro Wireless is a wireless gaming headset from SteelSeries. See the details below for the key features.','Wireless connection|Arctis Nova Pro series|Gaming headset'),(62,'Accessories','HyperX Cloud III',8250,12,'/images/products/hyperx-cloud-iii.jpg','HyperX','HyperX Cloud III is a gaming headset from HyperX. See the details below for the key features.','Cloud III series|Comfort-focused design|Gaming headset'),(63,'Accessories','Logitech MX Master 3S',9500,12,'/images/products/logitech-mx-master-3s.jpg','Logitech','Logitech MX Master 3S is a wireless mouse from Logitech. See the details below for the key features.','Wireless connection|Ergonomic design|Built for productivity'),(64,'Accessories','MSI Claw 8 AI+',95000,6,'/images/products/msi-claw-8-ai.jpg','MSI','MSI Claw 8 AI+ is a handheld gaming PC from MSI. See the details below for the key features.','8-inch display|AI+ model|Handheld gaming PC');
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transaction`
--

DROP TABLE IF EXISTS `transaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaction` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date_time` datetime(6) DEFAULT NULL,
  `product_id` int NOT NULL,
  `product_name` varchar(255) DEFAULT NULL,
  `quantity` int NOT NULL,
  `type` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaction`
--

LOCK TABLES `transaction` WRITE;
/*!40000 ALTER TABLE `transaction` DISABLE KEYS */;
INSERT INTO `transaction` VALUES (1,'2026-09-20 18:35:34.422811',3,'Gaming Laptop',5,'STOCK_IN'),(2,'2026-09-20 18:36:05.753901',3,'Gaming Laptop',3,'STOCK_OUT'),(3,'2026-10-04 00:40:35.212872',10,'Gaming Keyboard',1,'STOCK_OUT'),(4,'2026-10-04 00:40:35.207037',10,'Gaming Keyboard',1,'STOCK_OUT'),(5,'2026-10-04 00:40:35.206525',10,'Gaming Keyboard',1,'STOCK_OUT'),(6,'2026-10-04 00:40:35.206525',10,'Gaming Keyboard',1,'STOCK_OUT'),(7,'2026-10-04 00:40:35.210053',10,'Gaming Keyboard',1,'STOCK_OUT'),(8,'2026-10-04 00:40:35.208051',10,'Gaming Keyboard',1,'STOCK_OUT'),(9,'2026-10-04 00:40:35.460419',10,'Gaming Keyboard',1,'STOCK_OUT'),(10,'2026-10-04 00:40:35.464440',10,'Gaming Keyboard',1,'STOCK_OUT'),(11,'2026-10-04 00:40:35.462440',10,'Gaming Keyboard',1,'STOCK_OUT'),(12,'2026-10-04 00:40:35.467457',10,'Gaming Keyboard',1,'STOCK_OUT'),(13,'2026-10-04 00:40:35.465454',10,'Gaming Keyboard',1,'STOCK_OUT'),(14,'2026-10-04 00:40:37.670674',10,'Gaming Keyboard',1,'STOCK_OUT'),(15,'2026-10-04 00:40:38.225982',10,'Gaming Keyboard',1,'STOCK_OUT'),(16,'2026-10-04 00:40:38.769490',10,'Gaming Keyboard',1,'STOCK_OUT'),(17,'2026-10-04 00:40:39.001173',10,'Gaming Keyboard',1,'STOCK_OUT'),(18,'2026-10-07 23:41:34.161759',61,'SteelSeries Arctis Nova Pro Wireless',1,'STOCK_OUT'),(19,'2026-10-07 23:41:34.382551',61,'SteelSeries Arctis Nova Pro Wireless',1,'STOCK_OUT'),(20,'2026-10-07 23:41:34.489145',61,'SteelSeries Arctis Nova Pro Wireless',1,'STOCK_OUT'),(21,'2026-10-07 23:41:34.636473',61,'SteelSeries Arctis Nova Pro Wireless',1,'STOCK_OUT'),(22,'2026-10-07 23:41:34.822412',61,'SteelSeries Arctis Nova Pro Wireless',1,'STOCK_OUT'),(23,'2026-10-07 23:41:35.002776',61,'SteelSeries Arctis Nova Pro Wireless',1,'STOCK_OUT'),(24,'2026-10-07 23:41:35.133551',61,'SteelSeries Arctis Nova Pro Wireless',1,'STOCK_OUT'),(25,'2026-10-07 23:41:37.686107',61,'SteelSeries Arctis Nova Pro Wireless',1,'STOCK_IN'),(26,'2026-10-07 23:41:39.109044',61,'SteelSeries Arctis Nova Pro Wireless',1,'STOCK_IN'),(27,'2026-10-07 23:41:39.233543',61,'SteelSeries Arctis Nova Pro Wireless',1,'STOCK_IN'),(28,'2026-10-07 23:41:39.352665',61,'SteelSeries Arctis Nova Pro Wireless',1,'STOCK_IN'),(29,'2026-10-07 23:41:39.478766',61,'SteelSeries Arctis Nova Pro Wireless',1,'STOCK_IN'),(30,'2026-10-07 23:41:39.612644',61,'SteelSeries Arctis Nova Pro Wireless',1,'STOCK_IN'),(31,'2026-10-07 23:41:39.725117',61,'SteelSeries Arctis Nova Pro Wireless',1,'STOCK_IN'),(32,'2026-10-07 23:41:39.847074',61,'SteelSeries Arctis Nova Pro Wireless',1,'STOCK_IN'),(33,'2026-10-07 23:41:39.972356',61,'SteelSeries Arctis Nova Pro Wireless',1,'STOCK_IN');
/*!40000 ALTER TABLE `transaction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('EMPLOYEE','USER') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (2,'sanchit@gmail.com','Sanchit','$2a$10$XuIYn7B1r0Itgc73klAqOu/EI93Gj3MVzDueYOhqPAa.FMxYsoaiy','USER'),(3,'demo@gmail.com','demo','$2a$10$raW6lZlWqMcC6EFsvGYo6upYLsTaTdGWPYzcxSn9jvoXDv4BG1gwu','USER'),(4,'employee@techhub.com','TechHUB Employee','$2a$10$0xrmCHj7C0WgDCSXtQny0.7ZmTxrY9218qA9oeNh6iQ7a2k47Ib9S','EMPLOYEE');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-08  2:18:01

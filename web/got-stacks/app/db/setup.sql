-- MySQL dump 10.13  Distrib 8.0.18
--
-- Host: 127.0.0.1    Database: gotstacks
-- ------------------------------------------------------

--
-- Table structure for table `stock`
--

CREATE DATABASE gotstacks;
USE gotstacks;

SET sql_notes = 0;

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE IF NOT EXISTS `stock` (
  `stockid` int(11) NOT NULL PRIMARY KEY,
  `name` varchar(255) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `vurl` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock`
--

LOCK TABLES `stock` WRITE;
/*!40000 ALTER TABLE `stock` DISABLE KEYS */;
INSERT INTO `stock` VALUES (4923,'redpwnchess',10,'192.168.1.10'),(8231,'redpwnbowling',7,'192.168.1.11');
/*!40000 ALTER TABLE `stock` ENABLE KEYS */;
UNLOCK TABLES;

SET sql_notes = 1;

CREATE USER IF NOT EXISTS 'redpwnuser'@'127.0.0.1' IDENTIFIED BY 'redpwnpassword';

GRANT FILE on *.* to 'redpwnuser'@'127.0.0.1';
GRANT SELECT on gotstacks.* to 'redpwnuser'@'127.0.0.1';
GRANT INSERT on gotstacks.* to 'redpwnuser'@'127.0.0.1';

FLUSH PRIVILEGES;

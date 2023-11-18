-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.31 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.5.0.6677
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for bkptrk
CREATE DATABASE IF NOT EXISTS `bkptrk` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `bkptrk`;

-- Dumping structure for table bkptrk.bkp000
CREATE TABLE IF NOT EXISTS `bkp000` (
  `bktcodigo` int NOT NULL AUTO_INCREMENT,
  `bktclncodigo` int NOT NULL,
  `bktnomearquivo` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `bktrecorrencia` int DEFAULT NULL,
  `bktsituacao` char(1) COLLATE utf8mb4_general_ci NOT NULL,
  `bktdatasituacao` datetime NOT NULL,
  `bktdatacriacao` datetime NOT NULL,
  `bktusercodigo` int NOT NULL,
  PRIMARY KEY (`bktcodigo`),
  KEY `bkp000_fk0` (`bktclncodigo`),
  KEY `bkp000_fk2` (`bktusercodigo`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table bkptrk.bkp001
CREATE TABLE IF NOT EXISTS `bkp001` (
  `clncodigo` int NOT NULL AUTO_INCREMENT,
  `clnbkpcaminho` varchar(300) COLLATE utf8mb4_general_ci NOT NULL,
  `clndescricao` varchar(500) COLLATE utf8mb4_general_ci NOT NULL,
  `clndescricaoreduzido` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `clnchavelogin` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `clnchavepwd` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `clncorprimaria` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `clncorsecundaria` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `clncorfonte` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `clnsituacao` char(1) COLLATE utf8mb4_general_ci NOT NULL,
  `clndatasituacao` datetime NOT NULL,
  `clndatacriacao` datetime NOT NULL,
  `clnusercodigo` int NOT NULL,
  PRIMARY KEY (`clncodigo`),
  KEY `bkp001_fk0` (`clnusercodigo`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table bkptrk.bkp002
CREATE TABLE IF NOT EXISTS `bkp002` (
  `usercodigo` int NOT NULL AUTO_INCREMENT,
  `usernome` varchar(300) COLLATE utf8mb4_general_ci NOT NULL,
  `useremail` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `userlogin` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `userpassword` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `useradm` char(1) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `usersituacao` char(1) COLLATE utf8mb4_general_ci NOT NULL,
  `userdatasituacao` datetime NOT NULL,
  `userdatacriacao` datetime NOT NULL,
  PRIMARY KEY (`usercodigo`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table bkptrk.bkp003
CREATE TABLE IF NOT EXISTS `bkp003` (
  `sitcodigo` int NOT NULL AUTO_INCREMENT,
  `sitdescricao` varchar(300) COLLATE utf8mb4_general_ci NOT NULL,
  `sitreduzido` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `sitordem` int DEFAULT NULL,
  `sitcorprimaria` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `sitcorsecundaria` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `sitcorfonte` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `sitsituacao` char(1) COLLATE utf8mb4_general_ci NOT NULL,
  `sitdatasituacao` datetime NOT NULL,
  `sitdatacriacao` datetime NOT NULL,
  `situsercodigo` int NOT NULL,
  PRIMARY KEY (`sitcodigo`),
  KEY `bkp003_fk0` (`situsercodigo`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table bkptrk.bkp004
CREATE TABLE IF NOT EXISTS `bkp004` (
  `hiscodigo` int NOT NULL AUTO_INCREMENT,
  `hisdata` date NOT NULL,
  `hisnomecompleto` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `hisdatacriacao` datetime DEFAULT NULL,
  `hissitcodigo` int NOT NULL,
  `hisreccodigo` int NOT NULL,
  `hisbktcodigo` int NOT NULL,
  PRIMARY KEY (`hiscodigo`),
  KEY `bkp004_fk1` (`hissitcodigo`),
  KEY `bkp004_fk2` (`hisreccodigo`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=157 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table bkptrk.bkp005
CREATE TABLE IF NOT EXISTS `bkp005` (
  `reccodigo` int NOT NULL AUTO_INCREMENT,
  `recbktcodigo` int DEFAULT NULL,
  `recsitcodigo` int DEFAULT NULL,
  `recnumero` int DEFAULT NULL,
  `recsituacao` char(1) DEFAULT NULL,
  `recdatasituacao` datetime DEFAULT NULL,
  `recdatacriacao` datetime DEFAULT NULL,
  PRIMARY KEY (`reccodigo`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;

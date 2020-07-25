-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 25, 2020 at 12:18 PM
-- Server version: 10.4.13-MariaDB
-- PHP Version: 7.4.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `covid19_api_philippines`
--

-- --------------------------------------------------------

--
-- Table structure for table `case_informations`
--

CREATE TABLE `case_informations` (
  `case_code` varchar(7) DEFAULT NULL,
  `age` int DEFAULT NULL,
  `age_group` varchar(8) DEFAULT NULL,
  `sex` varchar(6) DEFAULT NULL,
  `date_specimen` varchar(10) DEFAULT NULL,
  `date_result_release` varchar(10) DEFAULT NULL,
  `date_rep_conf` varchar(10) DEFAULT NULL,
  `date_died` varchar(10) DEFAULT NULL,
  `date_recover` varchar(10) DEFAULT NULL,
  `removal_type` varchar(9) DEFAULT NULL,
  `admitted` varchar(3) DEFAULT NULL,
  `region_res` varchar(30) DEFAULT NULL,
  `prov_res` varchar(32) DEFAULT NULL,
  `city_mun_res` varchar(33) DEFAULT NULL,
  `city_muni_psgc` varchar(11) DEFAULT NULL,
  `health_status` varchar(12) DEFAULT NULL,
  `quarantined` varchar(3) DEFAULT NULL,
  `date_onset` varchar(10) DEFAULT NULL,
  `pregnant_tab` varchar(3) DEFAULT NULL,
  `validation_status` varchar(636) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for table `case_informations`
--
ALTER TABLE `case_informations`
  ADD PRIMARY KEY (`case_code`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

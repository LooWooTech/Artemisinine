/*
Navicat MySQL Data Transfer

Source Server         : 90
Source Server Version : 50173
Source Host           : 10.22.102.90:3306
Source Database       : artemisinine

Target Server Type    : MYSQL
Target Server Version : 50173
File Encoding         : 65001

Date: 2015-11-03 09:45:38
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for files
-- ----------------------------
DROP TABLE IF EXISTS `files`;
CREATE TABLE `files` (
  `ID` int(10) NOT NULL AUTO_INCREMENT,
  `Thing` varchar(255) DEFAULT NULL,
  `Year` varchar(255) DEFAULT NULL,
  `FileName` varchar(255) DEFAULT NULL,
  `CreateTime` datetime DEFAULT NULL,
  `CheckTime` datetime DEFAULT NULL,
  `State` bit(1) NOT NULL,
  `ProcessMessage` varchar(1023) DEFAULT NULL,
  `SavePath` varchar(1023) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of files
-- ----------------------------
INSERT INTO `files` VALUES ('1', '霍乱', '2015', '医疗机构疾病数据.xlsx', '2015-10-14 10:54:20', '0001-01-01 00:00:00', '\0', null, 'F:\\Github\\Artemisinine\\LoowooTech.Artemisinine\\LoowooTech.Artemisinine\\Uploads\\医疗机构疾病数据-635804168604665004.xlsx');
INSERT INTO `files` VALUES ('2', '霍乱', '2014', '医疗机构疾病数据.xlsx', '2015-10-16 10:53:02', '0001-01-01 00:00:00', '\0', null, 'F:\\Github\\Artemisinine\\LoowooTech.Artemisinine\\LoowooTech.Artemisinine\\Uploads\\医疗机构疾病数据-635805895829734250.xlsx');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `ID` int(10) NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) DEFAULT NULL,
  `Password` varchar(255) DEFAULT NULL,
  `Role` int(2) DEFAULT NULL,
  `LastLoginTime` datetime DEFAULT NULL,
  `LastLoginIP` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES ('1', 'Admin1', 'e3afed0047b08059d0fada10f400c1e5', '0', '2015-10-10 17:02:46', '::1');
INSERT INTO `users` VALUES ('2', 'Admin', 'e3afed0047b08059d0fada10f400c1e5', '1', '2015-11-03 09:01:27', '::1');

/*
Navicat MySQL Data Transfer

Source Server         : 90
Source Server Version : 50173
Source Host           : 10.22.102.90:3306
Source Database       : artemisinine

Target Server Type    : MYSQL
Target Server Version : 50173
File Encoding         : 65001

Date: 2015-11-07 14:47:54
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
  `State` int(2) NOT NULL,
  `ProcessMessage` varchar(1023) DEFAULT NULL,
  `SavePath` varchar(1023) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of files
-- ----------------------------
INSERT INTO `files` VALUES ('1', 'AA01', '2015', '医疗机构疾病数据.xlsx', '2015-10-14 10:54:20', '0001-01-01 00:00:00', '2', null, 'F:\\Github\\Artemisinine\\LoowooTech.Artemisinine\\LoowooTech.Artemisinine\\Uploads\\医疗机构疾病数据-635804168604665004.xlsx');
INSERT INTO `files` VALUES ('2', 'Rabies00', '2014', '医疗机构疾病数据.xlsx', '2015-10-16 10:53:02', '0001-01-01 00:00:00', '0', null, 'F:\\Github\\Artemisinine\\LoowooTech.Artemisinine\\LoowooTech.Artemisinine\\Uploads\\医疗机构疾病数据-635805895829734250.xlsx');

-- ----------------------------
-- Table structure for records
-- ----------------------------
DROP TABLE IF EXISTS `records`;
CREATE TABLE `records` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Year` int(11) NOT NULL,
  `Month` int(11) NOT NULL,
  `Day` int(11) NOT NULL,
  `SickName` varchar(255) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of records
-- ----------------------------
INSERT INTO `records` VALUES ('1', '2015', '9', '1', 'AA01');
INSERT INTO `records` VALUES ('2', '2015', '9', '2', 'AA01');
INSERT INTO `records` VALUES ('3', '2015', '9', '3', 'AA01');
INSERT INTO `records` VALUES ('4', '2015', '9', '4', 'AA01');
INSERT INTO `records` VALUES ('5', '2015', '9', '5', 'AA01');
INSERT INTO `records` VALUES ('6', '2015', '9', '6', 'AA01');
INSERT INTO `records` VALUES ('7', '2015', '9', '7', 'AA01');
INSERT INTO `records` VALUES ('8', '2015', '9', '8', 'AA01');
INSERT INTO `records` VALUES ('9', '2015', '9', '9', 'AA01');
INSERT INTO `records` VALUES ('10', '2015', '9', '10', 'AA01');
INSERT INTO `records` VALUES ('11', '2015', '9', '11', 'AA01');
INSERT INTO `records` VALUES ('12', '2015', '9', '12', 'AA01');
INSERT INTO `records` VALUES ('13', '2015', '10', '1', 'AA01');
INSERT INTO `records` VALUES ('14', '2015', '10', '2', 'AA01');
INSERT INTO `records` VALUES ('15', '2015', '10', '3', 'AA01');
INSERT INTO `records` VALUES ('16', '2015', '10', '4', 'AA01');
INSERT INTO `records` VALUES ('17', '2015', '10', '5', 'AA01');
INSERT INTO `records` VALUES ('18', '2015', '10', '6', 'AA01');
INSERT INTO `records` VALUES ('19', '2015', '10', '7', 'AA01');
INSERT INTO `records` VALUES ('20', '2015', '10', '8', 'AA01');
INSERT INTO `records` VALUES ('21', '2015', '10', '9', 'AA01');
INSERT INTO `records` VALUES ('22', '2015', '10', '10', 'AA01');
INSERT INTO `records` VALUES ('23', '2015', '10', '11', 'AA01');
INSERT INTO `records` VALUES ('24', '2015', '10', '12', 'AA01');
INSERT INTO `records` VALUES ('25', '2014', '9', '1', 'Rabies00');
INSERT INTO `records` VALUES ('26', '2014', '9', '2', 'Rabies00');
INSERT INTO `records` VALUES ('27', '2014', '9', '3', 'Rabies00');
INSERT INTO `records` VALUES ('28', '2014', '9', '4', 'Rabies00');
INSERT INTO `records` VALUES ('29', '2014', '9', '5', 'Rabies00');
INSERT INTO `records` VALUES ('30', '2014', '9', '6', 'Rabies00');
INSERT INTO `records` VALUES ('31', '2014', '9', '7', 'Rabies00');
INSERT INTO `records` VALUES ('32', '2014', '9', '8', 'Rabies00');
INSERT INTO `records` VALUES ('33', '2014', '9', '9', 'Rabies00');
INSERT INTO `records` VALUES ('34', '2014', '9', '10', 'Rabies00');
INSERT INTO `records` VALUES ('35', '2014', '9', '11', 'Rabies00');
INSERT INTO `records` VALUES ('36', '2014', '9', '12', 'Rabies00');
INSERT INTO `records` VALUES ('37', '2014', '10', '1', 'Rabies00');
INSERT INTO `records` VALUES ('38', '2014', '10', '2', 'Rabies00');
INSERT INTO `records` VALUES ('39', '2014', '10', '3', 'Rabies00');
INSERT INTO `records` VALUES ('40', '2014', '10', '4', 'Rabies00');
INSERT INTO `records` VALUES ('41', '2014', '10', '5', 'Rabies00');
INSERT INTO `records` VALUES ('42', '2014', '10', '6', 'Rabies00');
INSERT INTO `records` VALUES ('43', '2014', '10', '7', 'Rabies00');
INSERT INTO `records` VALUES ('44', '2014', '10', '8', 'Rabies00');
INSERT INTO `records` VALUES ('45', '2014', '10', '9', 'Rabies00');
INSERT INTO `records` VALUES ('46', '2014', '10', '10', 'Rabies00');
INSERT INTO `records` VALUES ('47', '2014', '10', '11', 'Rabies00');
INSERT INTO `records` VALUES ('48', '2014', '10', '12', 'Rabies00');

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
INSERT INTO `users` VALUES ('2', 'Admin', 'e3afed0047b08059d0fada10f400c1e5', '1', '2015-11-06 10:40:10', '::1');

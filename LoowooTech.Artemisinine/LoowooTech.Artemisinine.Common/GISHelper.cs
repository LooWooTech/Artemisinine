using ESRI.ArcGIS.DataSourcesGDB;
using ESRI.ArcGIS.esriSystem;
using ESRI.ArcGIS.Geodatabase;
using LoowooTech.Artemisinine.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace LoowooTech.Artemisinine.Common
{
    public static class GISHelper
    {
        private static string Server { get; set; }
        private static string Instance { get; set; }
        private static string User { get; set; }
        private static string Password { get; set; }
        private static string Database { get; set; }
        private static string Version { get; set; }
        private static string SicknessName { get; set; }
        private static string CityName { get; set; }
        private static string CountyName { get; set; }
        private static string HospitalName { get; set; }
        private static IWorkspace SDEWorkspace { get; set; }
        static GISHelper()
        {
            Server = System.Configuration.ConfigurationManager.AppSettings["SERVER"];
            Instance = System.Configuration.ConfigurationManager.AppSettings["INSTANCE"];
            User = System.Configuration.ConfigurationManager.AppSettings["USER"];
            Password = System.Configuration.ConfigurationManager.AppSettings["PASSWORD"];
            Database = System.Configuration.ConfigurationManager.AppSettings["DATABASE"];
            Version = System.Configuration.ConfigurationManager.AppSettings["VERSION"];
            CountyName = System.Configuration.ConfigurationManager.AppSettings["CNAME"];
            CityName = System.Configuration.ConfigurationManager.AppSettings["QNAME"];
            HospitalName = System.Configuration.ConfigurationManager.AppSettings["HNAME"];
            SDEWorkspace = OpenSde();
        }

        private static IWorkspace arcSDEWorkspaceOpen(string server, string instance, string user, string password, string database, string version)
        {
            IPropertySet pPropertySet = new PropertySetClass();
            pPropertySet.SetProperty("SERVER", server);
            pPropertySet.SetProperty("INSTANCE", instance);
            pPropertySet.SetProperty("USER", user);
            pPropertySet.SetProperty("PASSWORD", password);
            pPropertySet.SetProperty("DATABASE", database);
            pPropertySet.SetProperty("VERSION", version);
            IWorkspaceFactory2 pWorkspaceFactory = new SdeWorkspaceFactoryClass();
            IWorkspace workspace = null;
            try
            {
                workspace = pWorkspaceFactory.Open(pPropertySet, 0);
            }
            catch (Exception ex)
            {
                Console.WriteLine("连接Sde时发生错误：" + ex.Message);
                return null;
            }
            return workspace;
        }
        /// <summary>
        /// 打开连接SDE
        /// </summary>
        /// <returns></returns>
        private static IWorkspace OpenSde()
        {
            return arcSDEWorkspaceOpen(Server, Instance, User, Password, Database, Version);
        }
        /// <summary>
        /// 打开要素类
        /// </summary>
        /// <param name="Workspace">工作空间</param>
        /// <param name="FeatureClassName">要素名称</param>
        /// <returns></returns>
        private static IFeatureClass GetFeatureClass(IWorkspace Workspace, string FeatureClassName)
        {
            IFeatureWorkspace featureWorkspace = Workspace as IFeatureWorkspace;
            IFeatureClass featureClass = null;
            try
            {
                featureClass = featureWorkspace.OpenFeatureClass(FeatureClassName);
            }
            catch (Exception ex)
            {
                Console.WriteLine("打开要素类：" + FeatureClassName + "失败！错误信息：" + ex.Message);
            }
            return featureClass;
        }

        public static Dictionary<DateTime, List<Sickness>> Operate(Dictionary<DateTime, List<Sickness>> Dict, string Thing)
        {
            if (SDEWorkspace == null)
            {
                Console.WriteLine("ArcSDE 连接失败！无法进行疾病数据录入工作..........");
                return null;
            }
            var keyDict = new Dictionary<DateTime, List<Sickness>>();

            return keyDict;
        }

        /// <summary>
        /// 给要素类中添加字段
        /// </summary>
        /// <param name="FeatureClass">增加的要素类</param>
        /// <param name="FieldName">字段名称</param>
        /// <param name="FieldType">字段类型</param>
        /// <returns></returns>
        public static IFeatureClass AddField(IFeatureClass FeatureClass, string FieldName,string FieldType="String")
        {
            if (FeatureClass == null)
            {
                System.Console.WriteLine("在featureClass中添加字段，featureClass为ynull");
                return null;
            }
            IClass pClass = FeatureClass as IClass;
            IFieldsEdit fieldsEdit = pClass as IFieldsEdit;
            IField field = new FieldClass();
            IFieldEdit2 fieldEdit = field as IFieldEdit2;
            switch (FieldType)
            {
                case "String":
                    fieldEdit.Type_2 = esriFieldType.esriFieldTypeString;
                    break;
                case "Double":
                    fieldEdit.Type_2 = esriFieldType.esriFieldTypeDouble;
                    break;
                case "Date":
                    fieldEdit.Type_2 = esriFieldType.esriFieldTypeDate;
                    break;
                default:
                    fieldEdit.Type_2 = esriFieldType.esriFieldTypeString;
                    break;
            }
            fieldEdit.Name_2 = FieldName;
            pClass.AddField(field);
            return FeatureClass;

        }
        /// <summary>
        /// 获取行政区名称和代码
        /// </summary>
        /// <param name="FeatureClass">抱哈行政信息要素类</param>
        /// <returns>行政区名称代码列表</returns>
        private static List<District> GetDistrict(IFeatureClass FeatureClass)
        {
            var list = new List<District>();
            int IndexName = FeatureClass.Fields.FindField("NAME");
            int IndexCode = FeatureClass.Fields.FindField("CNTY_CODE");
            IFeatureCursor featureCursor = FeatureClass.Search(null, false);
            IFeature feature = featureCursor.NextFeature();
            while (feature != null)
            {
                list.Add(new District()
                {
                    Name = feature.get_Value(IndexName).ToString(),
                    Code = feature.get_Value(IndexCode).ToString()
                });
                feature = featureCursor.NextFeature();
            }
            System.Runtime.InteropServices.Marshal.ReleaseComObject(featureCursor);
            return list;
        }

        private static District Search(List<District> List, string key)
        {
            foreach (var item in List)
            {
                if (item.Code == key)
                {
                    return item;
                }
            }
            return null;
        }
        public static void Statistic()
        {
            if (SDEWorkspace == null)
            {
                Console.WriteLine("ArcSDE 工作空间为空，无法进行疾病数据统计工作........");
                return;
            }
            IFeatureClass HFeatureClass = GetFeatureClass(SDEWorkspace, "sde.SDE.HOSPITAL");
            int IndexXZDM = HFeatureClass.Fields.FindField("XZDM");
            int IndexXZC = HFeatureClass.Fields.FindField("XZC");
            int IndexXZCDM = HFeatureClass.Fields.FindField("XZCDM");
            int IndexXZQ = HFeatureClass.Fields.FindField("XZQ");
            int IndexXZQDM = HFeatureClass.Fields.FindField("XZQDM");
            IFeatureClass CFeatureClass = GetFeatureClass(SDEWorkspace, "sde.SDE.COUNTY");
            var cList = GetDistrict(CFeatureClass);

            IFeatureCursor featureCursor = HFeatureClass.Search(null, false);
            IFeature feature = featureCursor.NextFeature();
            string XZDM = string.Empty;
            var xkey = string.Empty;
            District entry = null;
            while (feature != null)
            {
                XZDM = feature.get_Value(IndexXZDM).ToString();
                if (!string.IsNullOrEmpty(XZDM))
                {
                    xkey = XZDM.Substring(0, 6);
                    entry = Search(cList, xkey);
                    if (entry != null)
                    {
                        feature.set_Value(IndexXZC, entry.Name);
                        feature.set_Value(IndexXZCDM, entry.Code);
                        feature.set_Value(IndexXZQ, "南宁市");
                        feature.set_Value(IndexXZQDM, "450100");
                        feature.Store();
                    }
                    
                }
                feature = featureCursor.NextFeature();
            }
            System.Runtime.InteropServices.Marshal.ReleaseComObject(featureCursor);

            //获取行政区要素类
            //IFeatureClass CFeatureClass = GetFeatureClass(SDEWorkspace, CountyName);
            //if (CFeatureClass == null)
            //{
            //    Console.WriteLine("未获取行政区要素类");
            //    return;
            //}
            //foreach (var JGID in Dict.Keys)
            //{

            //}

        }
        public static void StatisticCounty()
        {
            if (SDEWorkspace == null)
            {
                Console.WriteLine("SDE为空");
                return;
            }
            IFeatureClass HFeatureClass = GetFeatureClass(SDEWorkspace, HospitalName);
            if (HFeatureClass == null)
            {
                Console.WriteLine("未获取医院要素类");
                return;
            }
            int IndexXZC = HFeatureClass.Fields.FindField("XZC");
            int IndexRabies = HFeatureClass.Fields.FindField("Rabies00");
            int IndexAA = HFeatureClass.Fields.FindField("AA01");
            Dictionary<string, double> DictAA = new Dictionary<string, double>();
            Dictionary<string, double> DictRabies = new Dictionary<string, double>();
            IFeatureCursor featureCursor = HFeatureClass.Search(null,false);
            IFeature feature = featureCursor.NextFeature();
            string XZC = string.Empty;
            var val = 0.0;
            while (feature != null)
            {
                XZC = feature.get_Value(IndexXZC).ToString();
                if (!string.IsNullOrEmpty(XZC))
                {
                    val = double.Parse(feature.get_Value(IndexRabies).ToString());
                    if (DictRabies.ContainsKey(XZC))
                    {
                        DictRabies[XZC] += val;
                    }
                    else
                    {
                        DictRabies.Add(XZC, val);
                    }
                    val = double.Parse(feature.get_Value(IndexAA).ToString());
                    if (DictAA.ContainsKey(XZC))
                    {
                        DictAA[XZC] += val;
                    }
                    else
                    {
                        DictAA.Add(XZC, val);
                    }
                }
                feature = featureCursor.NextFeature();
            }
            IFeatureClass CFeatureClass = GetFeatureClass(SDEWorkspace, CountyName);
            if (CFeatureClass == null)
            {
                Console.WriteLine("未获取行政村要素类");
                return;
            }
            int IndexCAA = CFeatureClass.Fields.FindField("AA01");
            if (IndexCAA == -1)
            {
                CFeatureClass = AddField(CFeatureClass, "AA01", "Double");
                IndexCAA = CFeatureClass.Fields.FindField("AA01");
            }
            int IndexCRabies = CFeatureClass.Fields.FindField("Rabies00");
            if (IndexCRabies == -1)
            {
                CFeatureClass = AddField(CFeatureClass, "Rabies00", "Double");
                IndexCRabies = CFeatureClass.Fields.FindField("Rabies00");
            }
            IQueryFilter queryFilter = new QueryFilterClass();
            
            foreach (var name in DictAA.Keys)
            {
                queryFilter.WhereClause = "NAME='" + name + "'";
                featureCursor = CFeatureClass.Search(queryFilter, false);
                feature = featureCursor.NextFeature();
                if (feature != null)
                {
                    feature.set_Value(IndexCAA, DictAA[name]);
                    feature.set_Value(IndexCRabies, DictRabies[name]);
                    feature.Store();
                }
            }
            System.Runtime.InteropServices.Marshal.ReleaseComObject(featureCursor);
     
        }
        
    }
}

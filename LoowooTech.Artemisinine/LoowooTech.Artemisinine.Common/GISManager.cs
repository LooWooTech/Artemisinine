﻿using ESRI.ArcGIS.DataSourcesFile;
using ESRI.ArcGIS.DataSourcesGDB;
using ESRI.ArcGIS.esriSystem;
using ESRI.ArcGIS.Geodatabase;
using ESRI.ArcGIS.Geometry;
using LoowooTech.Artemisinine.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml;

namespace LoowooTech.Artemisinine.Common
{
    public static class GISManager
    {
        private static string HospitalPath { get; set; }
        private static string HospitalName { get; set; }
        private static XmlDocument configXml { get; set; }
        private static string Server { get; set; }
        private static string Instance { get; set; }
        private static string User { get; set; }
        private static string Password { get; set; }
        private static string Database { get; set; }
        private static string Version { get; set; }
        private static string Folder { get; set; }
        private static string SicknessName { get; set; }
        private static string CityName { get; set; }
        private static string CountyName { get; set; }
        private static IWorkspace SDEWorkspace { get; set; }
        private static Dictionary<string, List<District>> XZCDict { get; set; }
        private static List<District> XZQList { get; set; }
        static GISManager()
        {
            HospitalPath = System.IO.Path.Combine(AppDomain.CurrentDomain.BaseDirectory, System.Configuration.ConfigurationManager.AppSettings["HOSPITAL"]);
            Folder = System.IO.Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Data");
            SicknessName = System.Configuration.ConfigurationManager.AppSettings["NAME"];
            configXml = new XmlDocument();
            try
            {
                configXml.Load(System.IO.Path.Combine(AppDomain.CurrentDomain.BaseDirectory, System.Configuration.ConfigurationManager.AppSettings["FIELDS"]));
            }
            catch
            {

            }
                  
            HospitalName = System.Configuration.ConfigurationManager.AppSettings["HNAME"];
            Server = System.Configuration.ConfigurationManager.AppSettings["SERVER"];
            Instance = System.Configuration.ConfigurationManager.AppSettings["INSTANCE"];
            User = System.Configuration.ConfigurationManager.AppSettings["USER"];
            Password = System.Configuration.ConfigurationManager.AppSettings["PASSWORD"];
            Database = System.Configuration.ConfigurationManager.AppSettings["DATABASE"];
            Version = System.Configuration.ConfigurationManager.AppSettings["VERSION"];
            CountyName = System.Configuration.ConfigurationManager.AppSettings["CNAME"];
            CityName = System.Configuration.ConfigurationManager.AppSettings["QNAME"];
            SDEWorkspace = OpenSde();
        }
        private static void InitSDE()
        {
            if (SDEWorkspace == null)
            {
                System.Console.WriteLine(string.Format("{0}:初始化SDE失败，SDEWorkspace为NULL", DateTime.Now));
                return;
            }
            if (XZCDict == null)
            {
                XZCDict = new Dictionary<string, List<District>>();
            }
            if (XZQList == null)
            {
                XZQList = new List<District>();
            }
            
            var CFeatureClass = GetFeatureClass(SDEWorkspace, CountyName);
            var QFeatureClass = GetFeatureClass(SDEWorkspace, CityName);
            if (CFeatureClass == null || QFeatureClass == null)
            {
                Console.WriteLine(string.Format("{0}:打开行政区要素类或者行政村要素类失败为NUll，初始化失败", DateTime.Now));
                return;
            }
            int IndexQName = QFeatureClass.Fields.FindField("NAME");
            int IndexQDM = QFeatureClass.Fields.FindField("CNTY_CODE");

            int IndexCName = CFeatureClass.Fields.FindField("NAME");
            int IndexCDM = CFeatureClass.Fields.FindField("CNTY_CODE");
            #region 读取行政村数据
            IFeatureCursor featureCursor = CFeatureClass.Search(null,true);
            IFeature feature = featureCursor.NextFeature();
            while (feature != null)
            {
                var code = feature.get_Value(IndexCDM).ToString();
                if (!string.IsNullOrEmpty(code))
                {
                    var key = code.Substring(0, 4);
                    if (!string.IsNullOrEmpty(key))
                    {
                        if (XZCDict.ContainsKey(key))
                        {
                            XZCDict[key].Add(new District()
                            {
                                Name = feature.get_Value(IndexCName).ToString(),
                                Code = code
                            });
                        }
                        else
                        {
                            XZCDict.Add(key, new List<District>(){new District(){
                                Name = feature.get_Value(IndexCName).ToString(),
                                Code = code
                             }});
                        }
                    }
                }
                
                feature = featureCursor.NextFeature();
            }

            #endregion

            #region 读取行政区数据
            featureCursor = QFeatureClass.Search(null, true);
            feature = featureCursor.NextFeature();
            while (feature != null)
            {
                var code = feature.get_Value(IndexQDM).ToString();
                if (!string.IsNullOrEmpty(code))
                {
                    XZQList.Add(new District()
                    {
                        Name = feature.get_Value(IndexQName).ToString(),
                        Code = code
                    });
                }
                feature = featureCursor.NextFeature();
            }

            System.Runtime.InteropServices.Marshal.ReleaseComObject(featureCursor);
            #endregion



        }
        private static List<NField> GetInitFields()
        {
            if (configXml == null)
            {
                Console.WriteLine("configXml,无法进行疾病数据整合");
                return null;
            }
            var list = new List<NField>();
            var nodes = configXml.SelectNodes("/Fields/Field");
            if (nodes != null)
            {
                for (var i = 0; i < nodes.Count; i++)
                {
                    list.Add(new NField()
                    {
                        Name = nodes[i].Attributes["Name"].Value,
                        Type = nodes[i].Attributes["Type"].Value
                    });
                }
            }
            return list;
        }
        private static IFeatureClass Create(IFeatureWorkspace featureWorkspace, string Name, esriGeometryType esriGeometryType,string ObjectID)
        {
            IFields pFields = new FieldsClass();
            IFieldsEdit pFieldsEdit = pFields as IFieldsEdit;
            IField pField = new FieldClass();
            IFieldEdit pFieldEdit = pField as IFieldEdit;
            pFieldEdit.Name_2 = "shape";
            pFieldEdit.Type_2 = esriFieldType.esriFieldTypeGeometry;

            IGeometryDef pGeometryDef = new GeometryDefClass();
            IGeometryDefEdit pGeometryDefEdit = pGeometryDef as IGeometryDefEdit;
            pGeometryDefEdit.GeometryType_2 = esriGeometryType;

            ISpatialReferenceFactory pSpatialReferenceFactory = new SpatialReferenceEnvironmentClass();
            ISpatialReference pSpatialReference = pSpatialReferenceFactory.CreateGeographicCoordinateSystem((int)esriSRGeoCSType.esriSRGeoCS_WGS1984);
            pSpatialReference.SetDomain(-6000000, 6000000, -6000000, 6000000);
            pGeometryDefEdit.SpatialReference_2 = pSpatialReference;
            pFieldEdit.GeometryDef_2 = pGeometryDef;
            pFieldsEdit.AddField(pField);

            pField = new FieldClass();
            pFieldEdit = pField as IFieldEdit;
            pFieldEdit.Name_2 = ObjectID;
            pFieldEdit.Type_2 = esriFieldType.esriFieldTypeOID;
            pFieldsEdit.AddField(pField);

            var NList = GetInitFields();
            foreach (var item in NList)
            {
                pField = new FieldClass();
                pFieldEdit = pField as IFieldEdit;
                pFieldEdit.Name_2 = item.Name;
                switch (item.Type)
                {
                    case "String":
                        pFieldEdit.Type_2 = esriFieldType.esriFieldTypeString;
                        break;
                    case "Date":
                        pFieldEdit.Type_2 = esriFieldType.esriFieldTypeDate;
                        break;
                    case "Double":
                        pFieldEdit.Type_2 = esriFieldType.esriFieldTypeDouble;
                        break;
                    default:
                        pFieldEdit.Type_2 = esriFieldType.esriFieldTypeString;
                        break;
                }
                pFieldsEdit.AddField(pField);
            }

            IFeatureClassDescription featureClassDescription = new FeatureClassDescriptionClass();
            IObjectClassDescription objectClassDescription = featureClassDescription as IObjectClassDescription;
            IFeatureClass featureClass = featureWorkspace.CreateFeatureClass(Name, pFields, objectClassDescription.InstanceCLSID, objectClassDescription.ClassExtensionCLSID, esriFeatureType.esriFTSimple, "shape", "");
            return featureClass;
        }
        private static SField GetPoint(string JGID, IFeatureClass FeatureClas, int Index,int IndexGDM,int IndexDM)
        {
            IQueryFilter queryFilter = new QueryFilterClass();
            queryFilter.WhereClause = "JGID='" + JGID + "'";
            IFeatureCursor featureCursor = FeatureClas.Search(queryFilter, true);
            IFeature feature = featureCursor.NextFeature();
            if (feature != null)
            {
                return new SField()
                {
                    Geometry = feature.Shape,
                    Name = feature.get_Value(Index).ToString(),
                    ZZJGDM=feature.get_Value(IndexGDM).ToString(),
                    XZDM=feature.get_Value(IndexDM).ToString()
                };
            }
            Console.WriteLine("未找到医疗机构ID为" + JGID + "的坐标信息");
            return null;
        }
        private static DiseaseBase Search(IFeatureClass featureClass, string JGID,int IndexData,int IndexTime)
        {
            IQueryFilter queryFilter = new QueryFilterClass();
            queryFilter.WhereClause = "JGID='"+JGID+"'";
            IFeatureCursor featureCursor = featureClass.Search(queryFilter, true);
            IFeature feature = featureCursor.NextFeature();
            if (feature != null)
            {
                return new DiseaseBase()
                {
                    Data = double.Parse(feature.get_Value(IndexData).ToString()),
                    Time = DateTime.Parse(feature.get_Value(IndexTime).ToString())
                };
            }
            return null;
        }
        private static IFeatureClass OpenShapeFileFeatureClass()
        {
            IWorkspaceFactory workspaceFactory = new ShapefileWorkspaceFactory();
            IWorkspace workspace = workspaceFactory.OpenFromFile(System.IO.Path.GetDirectoryName(HospitalPath), 0);
            IFeatureWorkspace featureWorkspace = workspace as IFeatureWorkspace;
            IFeatureClass featureClass = featureWorkspace.OpenFeatureClass(System.IO.Path.GetFileNameWithoutExtension(HospitalPath));
            return featureClass;
        }
        private static IFeatureClass GetFeatureClass(IWorkspace workspace, string FeatureClassName)
        {
            IFeatureWorkspace featureWorkspace = workspace as IFeatureWorkspace;
            IFeatureClass featureClass = null;
            try
            {
                 featureClass = featureWorkspace.OpenFeatureClass(FeatureClassName);
            }
            catch (Exception ex)
            {
                Console.WriteLine("打开要素类：" + FeatureClassName + "失败！错误信息："+ex.Message);
            }
            return featureClass;
        }
        private static IFeature Gain(IFeatureClass featureClass,string Filter)
        {
            IQueryFilter queryFilter = new QueryFilterClass();
            queryFilter.WhereClause = Filter;
            IFeatureCursor featureCursor = featureClass.Search(queryFilter, true);
            IFeature feature = featureCursor.NextFeature();
            return feature;
        }
        /// <summary>
        /// 保存疾病数据
        /// </summary>
        /// <param name="workspace">保存到的工作空间</param>
        /// <param name="list">疾病数据</param>
        /// <param name="time">时间</param>
        /// <param name="HFeatureClass">医疗机构要素类</param>
        /// <param name="Index">医疗机构中JGID的Index</param>
        /// <param name="FeatureClassName">保存的要素类名称</param>
        /// <param name="ObjectID">键名</param>
        /// <returns></returns>
        private static bool Save(IWorkspace workspace, List<Disease> list, DateTime time, IFeatureClass HFeatureClass, int Index,int IndexGDM,int IndexDM,string FeatureClassName,string ObjectID)
        {
            IFeatureClass featureClass = GetFeatureClass(workspace,FeatureClassName);
            if (featureClass == null)
            {
                IFeatureWorkspace featureWorkspace = workspace as IFeatureWorkspace;
                featureClass = Create(featureWorkspace, FeatureClassName,esriGeometryType.esriGeometryPoint,ObjectID);
            }
            int IndexJGID = featureClass.Fields.FindField("JGID");
            int IndexName = featureClass.Fields.FindField("NAME");
            int IndexData = featureClass.Fields.FindField("Data");
            int IndexTime = featureClass.Fields.FindField("Time");
            int IndexZZJGDM = featureClass.Fields.FindField("ZZJGDM");
            int IndexXZDM = featureClass.Fields.FindField("XZDM");
            int IndexXZC = featureClass.Fields.FindField("XZC");
            int IndexXZCDM = featureClass.Fields.FindField("XZCDM");
            int IndexXZQ = featureClass.Fields.FindField("XZQ");
            int IndexXZQDM = featureClass.Fields.FindField("XZQDM");
            District entry=null;
            try
            {
                foreach (var item in list)
                {
                    var result = GetPoint(item.JGID, HFeatureClass, Index,IndexGDM,IndexDM);
                    if (result.Geometry != null)
                    {
                        var feature = Gain(featureClass, string.Format("JGID='{0}'", item.JGID));
                        //feature = null;
                        //查找存在的疾病数据 存在更新Data以及时间数据，不存在则添加疾病数据
                        if (feature != null)
                        {
                            feature.set_Value(IndexData, item.Data);
                            feature.set_Value(IndexTime, item.Time);
                            feature.Store();
                        }
                        else
                        {
                            IFeatureBuffer featureBuffer = featureClass.CreateFeatureBuffer();
                            IFeatureCursor featureCursor = featureClass.Insert(true);
                            featureBuffer.Shape = result.Geometry;
                            featureBuffer.set_Value(IndexJGID, item.JGID);
                            featureBuffer.set_Value(IndexData, item.Data);
                            featureBuffer.set_Value(IndexName, result.Name);
                            featureBuffer.set_Value(IndexZZJGDM, result.ZZJGDM);
                            featureBuffer.set_Value(IndexXZDM, result.XZDM);
                            var xkey=result.XZDM.Substring(0,4);
                            if (XZCDict.ContainsKey(xkey))
                            {
                                var ykey=result.XZDM.Substring(0,6).ToUpper();
                                entry = XZCDict[xkey].FirstOrDefault(e => e.Code == ykey);
                                featureBuffer.set_Value(IndexXZC, entry.Name);
                                featureBuffer.set_Value(IndexXZCDM, entry.Code);
                            }
                            entry = Search(result.XZDM.Substring(0, 2));
                            if (entry != null)
                            {
                                featureBuffer.set_Value(IndexXZQ, entry.Name);
                                featureBuffer.set_Value(IndexXZQDM, entry.Code);
                            }
                            featureBuffer.set_Value(IndexTime, time);
                            object featureOID = featureCursor.InsertFeature(featureBuffer);
                            featureCursor.Flush();
                            System.Runtime.InteropServices.Marshal.ReleaseComObject(featureCursor);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            return true;
        }

        private static District Search(string Code)
        {
            foreach (var item in XZQList)
            {
                if (item.Code.Substring(0,2)==Code)
                {
                    return item;
                }
            }
            return null;
        }
        private static bool SaveInToShapefile(string FilePath,List<Disease> list,DateTime time,IFeatureClass HFeatureClass,int Index,int IndexGDM,int IndexDM)
        {
            IWorkspaceFactory workspaceFactory = new ShapefileWorkspaceFactory();
            IWorkspace workspace = workspaceFactory.OpenFromFile(System.IO.Path.GetDirectoryName(FilePath), 0);
            return  Save(workspace, list, time, HFeatureClass, Index,IndexGDM,IndexDM, System.IO.Path.GetFileNameWithoutExtension(FilePath), "FID");

            #region

            /*
            IFeatureWorkspace featureWorkspace = workspace as IFeatureWorkspace;
            IFeatureClass featureClass=null;
            try
            {
                featureClass = featureWorkspace.OpenFeatureClass(System.IO.Path.GetFileNameWithoutExtension(FilePath));
            }
            catch (Exception ex)
            {
                //Console.WriteLine(ex.Message);
            }
               
            if (featureClass == null)
            {
                featureClass = Create(featureWorkspace, System.IO.Path.GetFileNameWithoutExtension(FilePath), esriGeometryType.esriGeometryPoint,"FID");
            }
            int IndexJGID = featureClass.Fields.FindField("JGID");
            int IndexName = featureClass.Fields.FindField("NAME");
            int IndexData = featureClass.Fields.FindField("Data");
            int IndexTime = featureClass.Fields.FindField("Time");
            //IWorkspaceEdit workspaceEdit = workspace as IWorkspaceEdit;
            //workspaceEdit.StartEditing(true);
            //workspaceEdit.StartEditOperation();
            try
            {
                foreach (var item in list)
                {
                    var result = GetPoint(item.JGID, HFeatureClass, Index);
                    if (result.Geometry != null)
                    {
                        var feature = Gain(featureClass, string.Format("JGID='{0}'", item.JGID));
                        //查找存在的疾病数据 存在更新Data以及时间数据，不存在则添加疾病数据
                        if (feature != null)
                        {
                            feature.set_Value(IndexData, item.Data);
                            feature.set_Value(IndexTime, item.Time);
                            feature.Store();
                        }
                        else
                        {
                            IFeatureBuffer featureBuffer = featureClass.CreateFeatureBuffer();
                            IFeatureCursor featureCursor = featureClass.Insert(true);
                            featureBuffer.Shape = result.Geometry;
                            featureBuffer.set_Value(IndexJGID, item.JGID);
                            featureBuffer.set_Value(IndexData, item.Data);
                            featureBuffer.set_Value(IndexName, result.Name);
                            featureBuffer.set_Value(IndexTime, time);
                            object featureOID = featureCursor.InsertFeature(featureBuffer);
                            featureCursor.Flush();
                            System.Runtime.InteropServices.Marshal.ReleaseComObject(featureCursor);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("保存数据发生错误：" + ex.Message);
                //workspaceEdit.StopEditOperation();
                //workspaceEdit.StopEditing(false);
                return false;
            }
            //workspaceEdit.StopEditOperation();
            //workspaceEdit.StopEditing(true);

            return true;
            */
            #endregion
        }
        private static bool SaveInToSDE(IWorkspace workspace, List<Disease> list, DateTime Time, IFeatureClass HFeatureClass, int Index,int IndexGDM,int IndexDM,string FeatureClassName)
        {
            return Save(workspace, list, Time, HFeatureClass, Index,IndexGDM,IndexDM, FeatureClassName, "OBJECTID");
        }
        public static void CreateShapeFile(Dictionary<DateTime, List<Disease>> Dict)
        {
            if (string.IsNullOrEmpty(HospitalPath))
            {
                Console.WriteLine("未找到医疗机构坐标位置数据，无法进行疾病数据整合");
                return;
            }
            var HospitalFeatureClass = OpenShapeFileFeatureClass();
            Console.WriteLine("成功获取医疗机构数据！");
            var index = HospitalFeatureClass.Fields.FindField("NAME");
            var IndexGDM = HospitalFeatureClass.Fields.FindField("ZZJGDM");
            var IndexDM = HospitalFeatureClass.Fields.FindField("XZDM");
            foreach (var key in Dict.Keys)
            {
                var filePath = System.IO.Path.Combine(Folder, string.Format("{0}{1}{2}", key.Year, key.Month, key.Day));
                if (SaveInToShapefile(filePath, Dict[key], key, HospitalFeatureClass, index,IndexGDM,IndexDM))
                {
                    Console.WriteLine("成功生成文件" + filePath);
                }
            }
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
        private static IWorkspace OpenSde()
        {
            return arcSDEWorkspaceOpen(Server, Instance, User, Password, Database, Version);
        }
        public static void Operate(Dictionary<DateTime, List<Disease>> Dict,string Thing)
        {
            IWorkspace workspace = OpenSde();
            if (workspace == null)
            {
                Console.WriteLine("无法连接SDE失败！");
                return;
            }
            else
            {
                Console.WriteLine("成功连接SDE");
            }
            IFeatureClass HFeatureClass = GetFeatureClass(workspace, HospitalName);
            if (HFeatureClass == null)
            {
                Console.WriteLine("未找到医疗机构坐标数据,即将退出程序..............");
                return;
            }
            InitSDE();
            int Index=HFeatureClass.Fields.FindField("NAME");
            int IndexGDM = HFeatureClass.Fields.FindField("ZZJGDM");
            int IndexDM = HFeatureClass.Fields.FindField("XZDM");
            foreach (var key in Dict.Keys)
            {
                var featureClassName=string.Format("{0}{1}{2}{3}",Thing+SicknessName, key.Year.ToString("0000"), key.Month.ToString("00"), key.Day.ToString("00"));
                if (SaveInToSDE(workspace, Dict[key], key, HFeatureClass, Index,IndexGDM,IndexDM, featureClassName))
                {
                    Console.WriteLine("成功生成要素类：" + featureClassName);
                }
                else
                {
                    Console.WriteLine("生成要素类：" + featureClassName + "时，发生错误");
                }
            }
            
        }
        //保存到一个要素类中
        public static void OperateSum(Dictionary<DateTime, List<Disease>> Dict, string Thing)
        {
            IWorkspace workspace = OpenSde();
            if (workspace == null)
            {
                Console.WriteLine("无法连接SDE失败！");
                return;
            }
            else
            {
                Console.WriteLine("成功连接SDE");
            }
            IFeatureClass HFeatureClass = GetFeatureClass(workspace, HospitalName);
            if (HFeatureClass == null)
            {
                Console.WriteLine("未找到医疗机构坐标数据,即将退出程序..............");
                return;
            }
            int Index = HFeatureClass.Fields.FindField("NAME");
            int IndexGDM = HFeatureClass.Fields.FindField("ZZJGDM");
            int IndexDM = HFeatureClass.Fields.FindField("XZDM");
            string FeatureClassName = string.Format("{0}Sum", SicknessName);
            foreach (var key in Dict.Keys)
            {
                SaveInToSDE(workspace, Dict[key], key, HFeatureClass, Index,IndexGDM,IndexDM, FeatureClassName);
            }
        }
        /// <summary>
        /// 获取工作空间中所有的要素类
        /// </summary>
        /// <param name="workspace"></param>
        /// <returns></returns>
        private static List<string> GetFeatureClassNames(IWorkspace workspace,string key="")
        {
            var list = new List<string>();
            IFeatureWorkspace featureWorkspace = workspace as IFeatureWorkspace;
            IEnumDatasetName enumDatasetName = workspace.get_DatasetNames(esriDatasetType.esriDTFeatureClass^esriDatasetType.esriDTFeatureDataset);
            enumDatasetName.Reset();
            IDatasetName datasetName = enumDatasetName.Next();
            while (datasetName != null)
            {
                if (datasetName.Type == esriDatasetType.esriDTFeatureClass)
                {
                    if (datasetName.Name.Contains(key))
                    {
                        list.Add(datasetName.Name);
                    }
                }
                datasetName = enumDatasetName.Next();
            }
            return list;
        }   
        /// <summary>
        /// 查询医疗机构的所有疾病数据
        /// </summary>
        /// <param name="JGID"></param>
        /// <returns></returns>
        public static List<DiseaseBase> GetValues(string JGID)
        {
            var list = new List<DiseaseBase>();
            if (SDEWorkspace != null)
            {
                var featureClassNames = GetFeatureClassNames(SDEWorkspace);
                foreach (var item in featureClassNames)
                {
                    if (!item.Contains(SicknessName))
                    {
                        continue;
                    }
                    IFeatureClass featureClass = GetFeatureClass(SDEWorkspace, item);
                    if (featureClass == null)
                    {
                        Console.WriteLine("错误信息：未获取" + item + "要素类，无法进行数据读取");
                        continue;
                    }
                    int IndexData = featureClass.Fields.FindField("Data");
                    int IndexTime = featureClass.Fields.FindField("Time");
                    var entry = Search(featureClass, JGID, IndexData, IndexTime);
                    if (entry != null)
                    {
                        list.Add(entry);
                    }
                }
            }
            else
            {
                Console.WriteLine("SDE 未连接，无法进行查询.....");
            }
            return list;
        }
        public static List<string> GetXZC()
        {
            if (SDEWorkspace != null)
            {
                var CFeatureClass = GetFeatureClass(SDEWorkspace, CountyName);
                var Index = CFeatureClass.Fields.FindField("NAME");
                return GetList(CFeatureClass, Index);
            }
            return null;
        }
        public static List<string> GetList(IFeatureClass featureClass,int Index,string Filter=null)
        {
            var list = new List<string>();
            IQueryFilter queryFilter = new QueryFilterClass();
            queryFilter.WhereClause = Filter;
            IFeatureCursor featureCursor = featureClass.Search(queryFilter, true);
            IFeature feature = featureCursor.NextFeature();
            while (feature != null)
            {
                var value = feature.get_Value(Index).ToString();
                if (!string.IsNullOrEmpty(value))
                {
                    list.Add(value);
                }
                feature = featureCursor.NextFeature();
            }
            System.Runtime.InteropServices.Marshal.ReleaseComObject(featureCursor);
            return list;
        }
        private static double Statistics(IFeatureClass featureClass, string FieldName,string Filter)
        {
            IQueryFilter queryFilter = new QueryFilterClass();
            queryFilter.WhereClause = Filter;
            IFeatureCursor featureCursor = featureClass.Search(queryFilter, false);
            ICursor cursor = featureCursor as ICursor;
            if (cursor != null)
            {
                IDataStatistics datastatistics = new DataStatisticsClass();
                datastatistics.Cursor = cursor;
                datastatistics.Field = FieldName;
                IStatisticsResults statisticResult = datastatistics.Statistics;
                return statisticResult.Sum;
            }
            return 0.0;

        }
        public static Dictionary<DateTime, double> GetTrend(string XZC, Sick sicktype)
        {
            var dict = new Dictionary<DateTime, double>();
            if (SDEWorkspace != null)
            {
                var list = GetFeatureClassNames(SDEWorkspace, sicktype.ToString() + sicktype.GetDescription() + SicknessName);
                foreach (var item in list)
                {
                    var entry = item.Split('.');
                    if (entry.Count() != 3)
                    {
                        continue;
                    }
                    var time = ExcelHelper.GetDateTime(entry[2]);
                    if (!dict.ContainsKey(time))
                    {
                        var featureClass = GetFeatureClass(SDEWorkspace, item);
                        if (featureClass == null)
                        {
                            continue;
                        }
                        dict.Add(time, Statistics(featureClass, "Data", "XZC=" + XZC));
                    }
                }
            }
            return dict;
        } 
        
    }
}

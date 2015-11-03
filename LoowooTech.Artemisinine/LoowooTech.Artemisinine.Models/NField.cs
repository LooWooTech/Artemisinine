﻿using ESRI.ArcGIS.Geometry;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace LoowooTech.Artemisinine.Models
{
    public class NField
    {
        public string Name { get; set; }
        public string Type { get; set; }
    }

    public class SField
    {
        public IGeometry Geometry { get; set; }
        public string Name { get; set; }
        public string ZZJGDM { get; set; }
        public string XZDM { get; set; }
    }
    
    public class District
    {
        public string Name { get; set; }
        public string Code { get; set; }
    }
}

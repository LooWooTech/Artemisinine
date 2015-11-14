using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;

namespace LoowooTech.Artemisinine.Models
{
    public enum MapType
    {
        [Description("行政区")]
        Ward,
        [Description("医疗点")]
        Place,
        [Description("疾病情况")]
        Situation,
        [Description("热度图")]
        Heat,
        [Description("椭圆图")]
        Ellipse,
        [Description("发病图")]
        Onset,
        [Description("MSN")]
        MSN
    }
}

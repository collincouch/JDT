
using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using System.Threading.Tasks;

namespace WcfJDT
{
    public interface IPlan
    {
        [OperationContract]
        [WebGet(UriTemplate = "Plans/User/{id}")]
        List<Plan> GetPlansByUserId(int id);
    

    }
}

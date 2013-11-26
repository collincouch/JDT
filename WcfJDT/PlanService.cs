
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WcfJDT
{
    public class PlanService:IPlan
    {
        JDTEntities context;
        public PlanService()
        {
            context = new JDTEntities();
        }
        public List<Plan> GetPlansByUserId(int id)
        {
            return context.Plans.ToList();
        }
    }
}
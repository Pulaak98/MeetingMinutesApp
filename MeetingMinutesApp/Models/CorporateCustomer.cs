using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MeetingMinutesApp.Models
{

    [Table("Corporate_Customer_Tbl")]
    public class CorporateCustomer
    {
            public int Id { get; set; }

            public string Name { get; set; }
        
    }
}

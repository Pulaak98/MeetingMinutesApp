using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MeetingMinutesApp.Models
{

    [Table("Individual_Customer_Tbl")]
    public class IndividualCustomer
    {
        public int Id { get; set; }

        public string Name { get; set; }
    }
}

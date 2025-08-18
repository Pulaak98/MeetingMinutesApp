using System.ComponentModel.DataAnnotations;

namespace MeetingMinutesApp.Models
{
    public class MeetingMinutesDetail
    {
        public int Id { get; set; }
        public int MasterId { get; set; }
        public string ProductServiceName { get; set; }
        public int ProductServiceId { get; set; }
        public string Unit { get; set; }

        public int Quantity { get; set; }
    }
}

using MeetingMinutesApp.Data;
using MeetingMinutesApp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace MeetingMinutesApp.Controllers
{
    public class MeetingController : Controller
    {
        private readonly AppDbContext _context;

        public MeetingController(AppDbContext context)
        {
            _context = context;
        }
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public JsonResult GetCustomers(string type)
        {
            if (type == "Corporate")
                return Json(_context.CorporateCustomers.ToList());
            else
                return Json(_context.IndividualCustomers.ToList());
        }

        [HttpGet]
        public JsonResult GetProducts()
        {
            return Json(_context.ProductServices.ToList());
        }

        [HttpGet]
        public JsonResult GetProductUnit(int id)
        {
            var unit = _context.ProductServices.FirstOrDefault(p => p.Id == id)?.Unit;
            return Json(unit);
        }

        [HttpPost]
        public IActionResult Save([FromBody] MeetingMinutesMaster master)
        {
            if (master == null)
                return Json(new { success = false, message = "No data received" });

            if (master.Details == null || !master.Details.Any())
                return Json(new { success = false, message = "No products added" });

            using var transaction = _context.Database.BeginTransaction();
            try
            {
                var newIdParam = new SqlParameter
                {
                    ParameterName = "@NewId",
                    SqlDbType = System.Data.SqlDbType.Int,
                    Direction = System.Data.ParameterDirection.Output
                };

                _context.Database.ExecuteSqlRaw(
                    "EXEC Meeting_Minutes_Master_Save_SP @CustomerType, @CustomerId, @MeetingPlace, @Agenda, @Discussion, @Decision, @ClientSide, @HostSide, @MeetingDate, @MeetingTime, @NewId OUT",
                    new SqlParameter("@CustomerType", master.CustomerType),
                    new SqlParameter("@CustomerId", master.CustomerId),
                    new SqlParameter("@MeetingPlace", master.MeetingPlace),
                    new SqlParameter("@Agenda", master.Agenda),
                    new SqlParameter("@Discussion", master.Discussion),
                    new SqlParameter("@Decision", master.Decision),
                    new SqlParameter("@ClientSide", master.ClientSide),
                    new SqlParameter("@HostSide", master.HostSide),
                    new SqlParameter("@MeetingDate", master.MeetingDate == DateTime.MinValue ? DateTime.Now.Date : master.MeetingDate),
                    new SqlParameter("@MeetingTime", master.MeetingTime),
                    newIdParam
                );

                int masterId = (int)newIdParam.Value;

                foreach (var d in master.Details)
                {
                    _context.Database.ExecuteSqlRaw(
                        "EXEC Meeting_Minutes_Details_Save_SP @MasterId, @ProductServiceId, @ProductServiceName, @Unit, @Quantity",
                        new SqlParameter("@MasterId", masterId),
                        new SqlParameter("@ProductServiceId", d.ProductServiceId),
                        new SqlParameter("@ProductServiceName", d.ProductServiceName),
                        new SqlParameter("@Unit", d.Unit),
                        new SqlParameter("@Quantity", d.Quantity)
                    );
                }

                transaction.Commit();
                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                return Json(new { success = false, message = ex.Message });
            }
        }



    }

}

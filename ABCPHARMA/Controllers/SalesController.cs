
using Microsoft.AspNetCore.Mvc;
using ABCPHARMA.Models;
using ABCPHARMA.Services;

namespace ABCPHARMA.Controllers;

[Route("api/[controller]")]
[ApiController]
public class SalesController : ControllerBase
{
    private readonly JsonFileService _jsonFileService;

    public SalesController(JsonFileService jsonFileService)
    {
        _jsonFileService = jsonFileService;
    }

    // GET: api/sales
    [HttpGet]
    public async Task<IActionResult> GetSales()
    {
        var sales = await _jsonFileService.GetSalesAsync();
        return Ok(sales);
    }

    // POST: api/sales
    [HttpPost]
    public async Task<IActionResult> RecordSale([FromBody] SaleRequest request)
    {
        if (request.Quantity <= 0)
            return BadRequest("Quantity must be greater than zero.");

        var (sale, error) = await _jsonFileService.RecordSaleAsync(
            request.MedicineId,
            request.Quantity);

        if (error != null)
            return BadRequest(new { message = error });

        return Ok(sale);
    }
}

using ABCPHARMA.Models;
using ABCPHARMA.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ABCPHARMA.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedicinesController : ControllerBase
    {
        private readonly JsonFileService _jsonFileService;

        public MedicinesController(JsonFileService jsonFileService)
        {
            _jsonFileService = jsonFileService;
        }

        // GET: api/medicines
        [HttpGet]
        public async Task<IActionResult> GetMedicines()
        {
            var medicines = await _jsonFileService.GetMedicinesAsync();

            return Ok(medicines);
        }

        // GET: api/medicines/search?name=para
        [HttpGet("search")]
        public async Task<IActionResult> SearchMedicines(string name)
        {
            var medicines = await _jsonFileService.GetMedicinesAsync();

            var result = medicines
                .Where(m => m.FullName.Contains(
                    name ?? string.Empty,
                    StringComparison.OrdinalIgnoreCase))
                .ToList();

            return Ok(result);
        }

        // POST: api/medicines
        [HttpPost]
        public async Task<IActionResult> AddMedicine([FromBody] Medicine medicine)
        {
            if (string.IsNullOrWhiteSpace(medicine.FullName))
                return BadRequest("Medicine name is required.");

            if (string.IsNullOrWhiteSpace(medicine.Brand))
                return BadRequest("Brand is required.");

            if (medicine.Quantity < 0 || medicine.Price < 0)
                return BadRequest("Quantity and price cannot be negative.");

            medicine.Id = Guid.NewGuid();
            medicine.Price = decimal.Round(medicine.Price, 2);

            await _jsonFileService.AddMedicineAsync(medicine);

            return Created("/api/medicines", medicine);
        }
    }
}

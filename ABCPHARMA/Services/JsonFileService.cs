using System.Text.Json;
using ABCPHARMA.Models;

namespace ABCPHARMA.Services;

public class JsonFileService
{
    private readonly string _medicineFile;
    private readonly string _salesFile;

    private readonly JsonSerializerOptions _options = new()
    {
        WriteIndented = true
    };

    public JsonFileService(IWebHostEnvironment environment)
    {
        var dataPath = Path.Combine(
            environment.ContentRootPath, "Data");

        Directory.CreateDirectory(dataPath);

        _medicineFile = Path.Combine(dataPath, "medicines.json");
        _salesFile = Path.Combine(dataPath, "sales.json");

        if (!File.Exists(_medicineFile))
            File.WriteAllText(_medicineFile, "[]");

        if (!File.Exists(_salesFile))
            File.WriteAllText(_salesFile, "[]");
    }

    public async Task<List<Medicine>> GetMedicinesAsync()
    {
        var json = await File.ReadAllTextAsync(_medicineFile);

        return JsonSerializer.Deserialize<List<Medicine>>(json)
               ?? new List<Medicine>();
    }

    public async Task<List<Sale>> GetSalesAsync()
    {
        var json = await File.ReadAllTextAsync(_salesFile);

        return JsonSerializer.Deserialize<List<Sale>>(json)
               ?? new List<Sale>();
    }

    public async Task AddMedicineAsync(Medicine medicine)
    {
        var json = await File.ReadAllTextAsync(_medicineFile);

        var medicines =
            JsonSerializer.Deserialize<List<Medicine>>(json)
            ?? new List<Medicine>();

        medicines.Add(medicine);

        await File.WriteAllTextAsync(
            _medicineFile,
            JsonSerializer.Serialize(medicines, _options));
    }

    public async Task<(Sale? Sale, string? Error)> RecordSaleAsync(
        Guid medicineId, int quantity)
    {
        if (quantity <= 0)
            return (null, "Quantity must be greater than zero.");

        // 1. Read medicines
        var medicineJson = await File.ReadAllTextAsync(_medicineFile);

        var medicines =
            JsonSerializer.Deserialize<List<Medicine>>(medicineJson)
            ?? new List<Medicine>();

        // 2. Find medicine
        var medicine = medicines.FirstOrDefault(m => m.Id == medicineId);

        if (medicine == null)
            return (null, "Medicine not found.");

        // 3. Check stock
        if (medicine.Quantity < quantity)
            return (null, $"Only {medicine.Quantity} units are available.");

        // 4. Reduce stock
        medicine.Quantity -= quantity;

        // 5. Create sale
        var sale = new Sale
        {
            MedicineId = medicine.Id,
            MedicineName = medicine.FullName,
            Quantity = quantity,
            UnitPrice = medicine.Price,
            TotalAmount = decimal.Round(medicine.Price * quantity, 2),
            SoldAt = DateTime.UtcNow
        };

        // 6. Read existing sales
        var salesJson = await File.ReadAllTextAsync(_salesFile);

        var sales =
            JsonSerializer.Deserialize<List<Sale>>(salesJson)
            ?? new List<Sale>();

        sales.Add(sale);

        // 7. Save updated medicine stock
        await File.WriteAllTextAsync(
            _medicineFile,
            JsonSerializer.Serialize(medicines, _options));

        // 8. Save sale history
        await File.WriteAllTextAsync(
            _salesFile,
            JsonSerializer.Serialize(sales, _options));

        return (sale, null);
    }
}

# Printing & Packaging Workshop Management - AppSheet Design Spec

## 1. Table Structure & Column Types

### Table: KhachHang (Customers)
| Column Name | Type | Key/Ref | Formula / Initial Value |
| :--- | :--- | :--- | :--- |
| CustomerID | Text | Key | `UNIQUEID()` |
| Name | Name | Label | |
| Phone | Phone | | |
| Address | Address | | |
| SalesRep | Ref | Table: Users | `USEREMAIL()` |
| CustomerStatus | Enum | | Care, Pending, VIP |

### Table: DonHang (Orders)
| Column Name | Type | Key/Ref | Formula / Initial Value |
| :--- | :--- | :--- | :--- |
| OrderID | Text | Key | `UNIQUEID()` |
| CustomerID | Ref | Table: KhachHang | |
| OrderDate | Date | | `TODAY()` |
| ItemName | Text | Label | |
| Dimensions | Text | | e.g., "10x15cm" |
| PaperType | Enum | | Couche, Bristol, Ivory, Kraft... |
| Color | Text | | e.g., "4 màu" |
| Lamination | Enum | | Cán mờ, Cán bóng, Không cán |
| Quantity | Number | | |
| ProductionMethod| Enum | | Quick Print, Offset, Flexo, UV |
| FinalPrice | Price | | (Input from Excel) |
| TotalValue | Price | Virtual | `[Quantity] * [FinalPrice]` |
| Deposit | Price | | (Initial 50% recommended) |
| RemainingBalance| Price | Virtual | `[TotalValue] - [Deposit]` |
| CurrentStatus | Enum | | Sale Confirmed, Design, Printing, Post-processing, Packing, Delivered |
| DesignFile | Image | | |

### Table: ProductionLog
| Column Name | Type | Key/Ref | Formula / Initial Value |
| :--- | :--- | :--- | :--- |
| LogID | Text | Key | `UNIQUEID()` |
| OrderID | Ref | Table: DonHang | |
| Stage | Enum | | (Same as CurrentStatus) |
| UpdatedBy | Email | | `USEREMAIL()` |
| Timestamp | DateTime | | `NOW()` |

### Table: Materials (Vật tư)
| Column Name | Type | Key/Ref | Formula / Initial Value |
| :--- | :--- | :--- | :--- |
| MaterialID | Text | Key | `UNIQUEID()` |
| MaterialName | Text | Label | |
| StockQuantity | Number | | |
| Unit | Enum | | Tờ, Mét, Cuộn, Kg |
| Category | Enum | | Giấy, Mực, Decal, Ribbon |

### Table: Accounting (Công nợ)
| Column Name | Type | Key/Ref | Formula / Initial Value |
| :--- | :--- | :--- | :--- |
| TransactionID | Text | Key | `UNIQUEID()` |
| EntityType | Enum | | Customer, Supplier, Subcontractor |
| EntityID | Text | | (ID of the related entity) |
| Amount | Price | | |
| Type | Enum | | Income, Expense |
| Status | Enum | | Paid, Unpaid |
| RelatedOrderID | Ref | Table: DonHang | |

---

## 2. Key Formulas (Virtual Columns)

### Debt Calculation (Remaining Balance)
**Column:** `[RemainingBalance]`
**Formula:**
```excel
[TotalValue] - SUM(
  SELECT(Accounting[Amount], 
    AND(
      [RelatedOrderID] = [_THISROW].[OrderID],
      [Type] = "Income",
      [Status] = "Paid"
    )
  )
)
```

### Status Highlight (Aged Receivables)
To highlight orders delivered but unpaid:
**Format Rule Condition:**
```excel
AND(
  [CurrentStatus] = "Delivered",
  [RemainingBalance] > 0
)
```

---

## 3. Security Filters (Sales Role)

To restrict Sales from seeing sensitive data while allowing them to see all customers:

### Security Filter for `DonHang` (Orders):
```excel
OR(
  USERROLE() = "Admin",
  [SalesRep] = USEREMAIL()
)
```

### Column-Level Security (Gia Von / Profit):
In the `Show_If` property of sensitive columns:
```excel
USERROLE() = "Admin"
```

---

## 4. Automation: Export to Excel Template

1. **Create a Template:** Upload your Excel Quotation/Delivery Note to Google Drive. Use placeholders like `<<[ItemName]>>`, `<<[TotalValue]>>`.
2. **Bot Trigger:** Set a "Data Change" event on `DonHang` when `CurrentStatus` updates to "Delivered".
3. **Action:** Choose "Create a new file".
4. **HTTP Content Type:** `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`.
5. **File Folder Path:** `"/AppSheet/Exports/DeliveryNotes/" & [OrderID]`.

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Entities;
using TasteFlow.Domain.Interfaces;
using TasteFlow.Infrastructure.Repositories.Base;

namespace TasteFlow.Infrastructure.Repositories
{
    public class StockEntryItemRepository : BaseRepository<StockEntryItem>, IStockEntryItemRepository
    {
        public StockEntryItemRepository(TasteFlowContext context) : base(context)
        {
        }
    }
}

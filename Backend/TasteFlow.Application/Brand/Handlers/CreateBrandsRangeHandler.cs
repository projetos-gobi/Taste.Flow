using AutoMapper;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Brand.Commands;
using TasteFlow.Application.Brand.Responses;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;

namespace TasteFlow.Application.Brand.Handlers
{
    public class CreateBrandsRangeHandler : IRequestHandler<CreateBrandsRangeCommand, CreateBrandsRangeResponse>
    {
        private readonly IBrandRepository _brandRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public CreateBrandsRangeHandler(IBrandRepository brandRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _brandRepository = brandRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<CreateBrandsRangeResponse> Handle(CreateBrandsRangeCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var brands = _mapper.Map<IEnumerable<Domain.Entities.Brand>>(request.Brands);

                brands.ToList().ForEach(x => x.EnterpriseId = request.EnterpriseId);

                var result = await _brandRepository.CreateBrandsRangeAsync(brands);

                return new CreateBrandsRangeResponse(result, ((result) ? "Marcas criadas com sucesso." : "Não foi possível criar as marcas no sistema."));
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo de criação de marcas para empresa.";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return CreateBrandsRangeResponse.Empty("Ocorreu um erro durante o processo de criação de marcas para empresa.");
            }
        }
    }
}

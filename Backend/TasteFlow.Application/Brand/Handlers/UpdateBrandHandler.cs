using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;
using MediatR;
using TasteFlow.Application.Brand.Commands;
using TasteFlow.Application.Brand.Responses;

namespace TasteFlow.Application.Brand.Handlers
{
    public class UpdateBrandHandler : IRequestHandler<UpdateBrandCommand, UpdateBrandResponse>
    {
        private readonly IBrandRepository _brandRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public UpdateBrandHandler(IBrandRepository brandRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _brandRepository = brandRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<UpdateBrandResponse> Handle(UpdateBrandCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var brand = _mapper.Map<Domain.Entities.Brand>(request.Brand);

                var result = await _brandRepository.UpdateBrandAsync(brand, request.EnterpriseId);

                return new UpdateBrandResponse(result, (result) ? "Marca atualizada com sucesso." : "Não foi possível atualizar a marca.");
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo atualização de uma marca ID: {request.Brand.Id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return UpdateBrandResponse.Empty("Ocorreu um erro durante o processo atualização de uma marca.");
            }
        }
    }
}

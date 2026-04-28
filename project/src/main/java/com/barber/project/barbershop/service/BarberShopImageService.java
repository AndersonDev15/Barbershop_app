package com.barber.project.barbershop.service;

import com.barber.project.barbershop.dto.response.ImageResponse;
import com.barber.project.barbershop.entity.BarberShop;
import com.barber.project.barbershop.entity.BarberShopImage;
import com.barber.project.shared.Exception.BadRequestException;
import com.barber.project.shared.Exception.ResourceNotFoundException;
import com.barber.project.barbershop.repository.BarberShopImageRepository;
import com.cloudinary.Cloudinary;
import jakarta.validation.ValidationException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;


@Service
@AllArgsConstructor
public class BarberShopImageService {
    private final Cloudinary cloudinary;
    private final BarberShopImageRepository barberShopImageRepository;
    private final BarberShopService barberShopService;

    //subir imagen
    @Transactional
    public ImageResponse uploadImage(UUID ownerUuid, MultipartFile file){
        BarberShop barberShop = barberShopService.getOwnerBarberShop(ownerUuid);

        //validar
        validateImage(file);

        //limite de imagenes
        long count =  barberShopImageRepository.countByBarberShop(barberShop);
        if(count>=5){
            throw new ValidationException("Solo puedes subir un máximo de 5 imágenes");
        }

        try {
            Map uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    Map.of("folder", "barbershops/" + barberShop.getId())
            );
            String url = (String) uploadResult.get("secure_url");
            String publicId = (String) uploadResult.get("public_id");

            BarberShopImage image = new BarberShopImage();
            image.setImageUrl(url);
            image.setPublicId(publicId);
            image.setBarberShop(barberShop);
            BarberShopImage barberShopImage = barberShopImageRepository.save(image);
            return mapToResponse(barberShopImage);
        }catch (IOException e){
            throw new BadRequestException("No se pudo procesar la imagen: " + e.getMessage());
        } catch (Exception e) {
            throw new BadRequestException("Error al subir imagen: " + e.getMessage());
        }
    }

    //listar imagenes
    @Transactional(readOnly = true)
    public List<ImageResponse> listMyImages(UUID ownerUuid){
        BarberShop barberShop = barberShopService.getOwnerBarberShop(ownerUuid);
        List<BarberShopImage> images =  barberShopImageRepository.findByBarberShop(barberShop);
        return images.stream()
                .map(this::mapToResponse)
                .toList();
    }

    //eliminar imagen
    @Transactional
    public void deleteImage(Long imageId, UUID ownerUuid){
        BarberShop barberShop = barberShopService.getOwnerBarberShop(ownerUuid);
        BarberShopImage image = barberShopImageRepository.findByIdAndBarberShop(imageId,barberShop)
                .orElseThrow(()->new ResourceNotFoundException("Imagen no encontrada"));
        try {
            cloudinary.uploader().destroy(image.getPublicId(), Map.of());
            barberShopImageRepository.delete(image);
        }catch (Exception e){
            throw new BadRequestException("Error al eliminar imagen de Cloudinary" + e);
        }
    }

    //establecer portada.
    @Transactional
    public void setCoverImage(Long imageId, UUID ownerUuid){
        BarberShop barberShop = barberShopService.getOwnerBarberShop(ownerUuid);
        BarberShopImage image = barberShopImageRepository.findByIdAndBarberShop(imageId,barberShop)
                .orElseThrow(()->new ResourceNotFoundException("Imagen no encontrada"));

        //desmarcar portada anterior
        barberShopImageRepository.clearCoverForBarberShop(barberShop.getId());
        //nueva
        image.setCover(true);
        barberShopImageRepository.save(image);
    }



    //validaciones
    private void validateImage(MultipartFile file){
        if(file.isEmpty()){
            throw new ValidationException("El archivo esta vacio");
        }
        List<String> allowedTypes = List.of("image/jpge","image/png");

        if(!allowedTypes.contains(file.getContentType())){
            throw new ValidationException("Solo se permiten imágenes JPG y PNG");
        }

        if(file.getSize()>2 *1024 * 1024){
            throw new ValidationException("El tamaño máximo permitido es 2MB");
        }
    }

    //response
    private ImageResponse mapToResponse(BarberShopImage image){
        return new ImageResponse(
                image.getId(),
                image.getImageUrl(),
                image.isCover(),
                image.getUploadedAt()
        );
    }
}


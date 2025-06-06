package com.hansen.fateEchoes.fate_echoes.controller.api.v1;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * 媒体文件上传API控制器
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/media")
@CrossOrigin(
        origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175"},
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS},
        allowedHeaders = {"*"},
        allowCredentials = "true",
        maxAge = 3600
)
public class MediaUploadController {

    // 支持的图片格式
    private static final String[] SUPPORTED_IMAGE_TYPES = {
        "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"
    };

    // 支持的视频格式
    private static final String[] SUPPORTED_VIDEO_TYPES = {
        "video/mp4", "video/avi", "video/mov", "video/wmv", "video/webm"
    };

    // 最大文件大小：10MB
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024;

    /**
     * 上传媒体文件（图片或视频）
     * @param file 媒体文件
     * @param type 文件类型：image 或 video
     * @param bookId 书籍ID（用于文件夹分类）
     * @return 上传结果和文件URL
     */
    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadMedia(
            @RequestParam("file") MultipartFile file,
            @RequestParam("type") String type,
            @RequestParam("bookId") String bookId) {

        Map<String, Object> response = new HashMap<>();

        try {
            // 验证文件
            validateFile(file, type);

            // 生成文件路径
            String fileUrl = saveMediaFile(file, type, bookId);

            response.put("success", true);
            response.put("message", "文件上传成功");
            response.put("fileUrl", fileUrl);
            response.put("fileType", type);
            response.put("fileName", file.getOriginalFilename());
            response.put("fileSize", file.getSize());

            log.info("媒体文件上传成功: {} -> {}", file.getOriginalFilename(), fileUrl);

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            log.warn("文件验证失败: {}", e.getMessage());
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);

        } catch (Exception e) {
            log.error("文件上传失败", e);
            response.put("success", false);
            response.put("message", "文件上传失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * 验证上传的文件
     */
    private void validateFile(MultipartFile file, String type) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("文件不能为空");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("文件大小不能超过 10MB");
        }

        String contentType = file.getContentType();
        if (contentType == null) {
            throw new IllegalArgumentException("无法确定文件类型");
        }

        boolean isValidType = false;

        if ("image".equals(type)) {
            for (String supportedType : SUPPORTED_IMAGE_TYPES) {
                if (contentType.equals(supportedType)) {
                    isValidType = true;
                    break;
                }
            }
            if (!isValidType) {
                throw new IllegalArgumentException("不支持的图片格式，支持的格式：JPEG, PNG, GIF, WebP");
            }
        } else if ("video".equals(type)) {
            for (String supportedType : SUPPORTED_VIDEO_TYPES) {
                if (contentType.equals(supportedType)) {
                    isValidType = true;
                    break;
                }
            }
            if (!isValidType) {
                throw new IllegalArgumentException("不支持的视频格式，支持的格式：MP4, AVI, MOV, WMV, WebM");
            }
        } else {
            throw new IllegalArgumentException("不支持的文件类型，只支持 image 或 video");
        }
    }

    /**
     * 保存媒体文件到磁盘
     */
    private String saveMediaFile(MultipartFile file, String type, String bookId) throws IOException {
        // 获取文件扩展名
        String originalFilename = file.getOriginalFilename();
        String extension = getFileExtension(originalFilename);
        if (extension == null) {
            // 根据content type推断扩展名
            extension = inferExtensionFromContentType(file.getContentType());
        }

        // 生成唯一文件名
        String fileName = UUID.randomUUID().toString() + extension;

        // 构建文件路径
        String userDir = System.getProperty("user.dir");
        String uploadDir = userDir + File.separator + "uploads" + File.separator +
                          "media" + File.separator + bookId + File.separator + type + File.separator;

        // 创建目录
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            boolean created = directory.mkdirs();
            if (!created) {
                throw new IOException("无法创建上传目录: " + uploadDir);
            }
            log.info("成功创建上传目录: {}", uploadDir);
        }

        // 保存文件
        String filePath = uploadDir + fileName;
        File destFile = new File(filePath);

        try (InputStream inputStream = file.getInputStream();
             OutputStream outputStream = new FileOutputStream(destFile)) {

            byte[] buffer = new byte[8192];
            int bytesRead;
            while ((bytesRead = inputStream.read(buffer)) != -1) {
                outputStream.write(buffer, 0, bytesRead);
            }
        }

        // 返回相对路径（用于前端访问）
        String relativePath = "/uploads/media/" + bookId + "/" + type + "/" + fileName;
        log.info("媒体文件保存成功: {} -> {}", filePath, relativePath);

        return relativePath;
    }

    /**
     * 获取文件扩展名
     */
    private String getFileExtension(String filename) {
        if (filename == null || filename.lastIndexOf('.') == -1) {
            return null;
        }
        return filename.substring(filename.lastIndexOf('.'));
    }

    /**
     * 根据content type推断文件扩展名
     */
    private String inferExtensionFromContentType(String contentType) {
        switch (contentType) {
            case "image/jpeg":
            case "image/jpg":
                return ".jpg";
            case "image/png":
                return ".png";
            case "image/gif":
                return ".gif";
            case "image/webp":
                return ".webp";
            case "video/mp4":
                return ".mp4";
            case "video/avi":
                return ".avi";
            case "video/mov":
                return ".mov";
            case "video/wmv":
                return ".wmv";
            case "video/webm":
                return ".webm";
            default:
                return ".bin"; // 默认扩展名
        }
    }
}

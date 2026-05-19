# Retrofit + OkHttp
-keepattributes Signature
-keepattributes *Annotation*
-dontwarn okhttp3.**
-dontwarn okio.**
-dontwarn javax.annotation.**
-keep interface retrofit2.** { *; }
-keepclassmembers,allowshrinking,allowobfuscation interface * {
    @retrofit2.http.* <methods>;
}

# Gson — keep network DTOs, requests, responses
-keep class com.github.arseniji.barcodescanner.network.dto.** { *; }
-keep class com.github.arseniji.barcodescanner.network.request.** { *; }
-keep class com.github.arseniji.barcodescanner.network.response.** { *; }
-keep class com.github.arseniji.barcodescanner.model.ScannedItem { *; }

# kotlinx.serialization
-keepattributes RuntimeVisibleAnnotations,AnnotationDefault
-dontnote kotlinx.serialization.**
-keep class kotlinx.serialization.** { *; }

# Koin
-keep class org.koin.** { *; }
-dontwarn org.koin.**

# Preserve stack traces
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile
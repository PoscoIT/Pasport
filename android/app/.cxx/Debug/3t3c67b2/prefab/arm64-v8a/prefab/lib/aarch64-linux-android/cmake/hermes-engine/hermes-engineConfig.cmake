if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "/Users/fatih/.gradle/caches/8.14.3/transforms/f0ba56b0b49e7ff82160f19c41037e06/transformed/jetified-hermes-android-0.81.5-debug/prefab/modules/libhermes/libs/android.arm64-v8a/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/fatih/.gradle/caches/8.14.3/transforms/f0ba56b0b49e7ff82160f19c41037e06/transformed/jetified-hermes-android-0.81.5-debug/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()


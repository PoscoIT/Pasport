if(NOT TARGET hermes-engine::hermesvm)
add_library(hermes-engine::hermesvm SHARED IMPORTED)
set_target_properties(hermes-engine::hermesvm PROPERTIES
    IMPORTED_LOCATION "/Users/fatih/.gradle/caches/9.3.1/transforms/354644a224e4e10184d0396d82bb60ce/transformed/jetified-hermes-android-250829098.0.10-release/prefab/modules/hermesvm/libs/android.arm64-v8a/libhermesvm.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/fatih/.gradle/caches/9.3.1/transforms/354644a224e4e10184d0396d82bb60ce/transformed/jetified-hermes-android-250829098.0.10-release/prefab/modules/hermesvm/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()


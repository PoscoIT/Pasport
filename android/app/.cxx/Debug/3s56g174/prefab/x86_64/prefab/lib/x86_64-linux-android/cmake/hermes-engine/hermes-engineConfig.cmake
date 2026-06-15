if(NOT TARGET hermes-engine::hermesvm)
add_library(hermes-engine::hermesvm SHARED IMPORTED)
set_target_properties(hermes-engine::hermesvm PROPERTIES
    IMPORTED_LOCATION "/Users/fatih/.gradle/caches/9.3.1/transforms/78275b9d5c2c99272a3c863b85b03913/transformed/jetified-hermes-android-250829098.0.10-debug/prefab/modules/hermesvm/libs/android.x86_64/libhermesvm.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/fatih/.gradle/caches/9.3.1/transforms/78275b9d5c2c99272a3c863b85b03913/transformed/jetified-hermes-android-250829098.0.10-debug/prefab/modules/hermesvm/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()


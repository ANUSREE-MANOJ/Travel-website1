import { PACKAGE_URL,UPLOAD_URL } from "../constants";
import { apiSlice } from "./apiSlice";


export const packageSlice = apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        getPackages:builder.query({
            query:({keyword})=>({
                url:`${PACKAGE_URL}`,
                params:{keyword}
            }),
      keepUnusedDataFor: 5,
      providesTags: ["Packages"],
        }),

        getPackageById: builder.query({
            query: (packageId) => `${PACKAGE_URL}/${packageId}`,
            providesTags: (result, error, packageId) => [
              { type: "Package", id: packageId},
            ],
          }),
      
          allPackages: builder.query({
            query: () => `${PACKAGE_URL}/allPackages`,
          }),

          getPackageDetails: builder.query({
            query: (packageId) => ({
              url: `${PACKAGE_URL}/${packageId}`,
            }),
            keepUnusedDataFor: 5,
          }),

          createPackage: builder.mutation({
            query: (packageData) => ({
              url: `${PACKAGE_URL}`,
              method: "POST",
              body: packageData,
            }),
            invalidatesTags: ["Package"],
          }),
          updatePackage: builder.mutation({
            query: ({ packageId, formData }) => ({
              url: `${PACKAGE_URL}/${packageId}`,
              method: "PUT",
              body: formData,
            }),
          }),

          uploadPackageImage: builder.mutation({
            query: (data) => ({
              url: `${UPLOAD_URL}`,
              method: "POST",
              body: data,
            }),
          }),

          deletePackage: builder.mutation({
            query: (packageId) => ({
              url: `${PACKAGE_URL}/${packageId}`,
              method: "DELETE",
            }),
            providesTags: ["Package"],
          }),

          createReview: builder.mutation({
            query: (data) => ({
              url: `${PACKAGE_URL}/${data.projectId}/reviews`,
              method: "POST",
              body: data,
            }),
          }),
      

    })
})

export const {
useGetPackageByIdQuery,
useGetPackagesQuery,
useGetPackageDetailsQuery,
useAllPackagesQuery,
useUpdatePackageMutation,
useDeletePackageMutation,
useCreateReviewMutation,

}= packageSlice
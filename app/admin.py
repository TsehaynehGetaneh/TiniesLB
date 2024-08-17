from django.contrib import admin
from .models import Product,Color, BrandCategory, Category
from import_export.admin import ImportExportModelAdmin
from .forms import ColorFieldWithName

@admin.register(Product)
class userdat(ImportExportModelAdmin):
    list_display = ('header', 'price', 'product_brand', 'company_name', 'age_category', 'in_stock', 'description')
    search_fields = ('header', 'company_name', 'product_brand')
    list_filter = ('in_stock', 'header', 'company_name')

@admin.register(Color)
class ColorAdmin(admin.ModelAdmin):
    form = ColorFieldWithName
    list_display = ('get_color_name_display', )
    search_fields = ('color', )

    def get_color_name_display(self, obj):
        return obj.get_color_name()

    get_color_name_display.short_description = 'Color Name'


@admin.register(BrandCategory)
class AllBrandsAdmin(admin.ModelAdmin):
    list_display = ('name', )
    search_fields = ('name', )

@admin.register(Category)
class AllCategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', )
    prepopulated_fields = {'slug' : ( 'name',)}
    search_fields = ('id', 'name', )
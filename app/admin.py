from django.contrib import admin
from .models import Product, Color, Brand, Category, SubCategory
from import_export.admin import ImportExportModelAdmin
from .forms import ColorFieldWithName

@admin.register(Product)
class ProductAdmin(ImportExportModelAdmin):
    list_display = ('name', 'price', 'brand', 'get_company_name', 'in_stock', 'description')
    search_fields = ('name', 'brand__name')
    list_filter = ('in_stock', 'name', 'brand__name')

    def get_company_name(self, obj):
        return obj.brand.name

    get_company_name.short_description = 'Company Name'

@admin.register(Color)
class ColorAdmin(admin.ModelAdmin):
    form = ColorFieldWithName
    list_display = ('get_color_name_display', )
    search_fields = ('color', )

    def get_color_name_display(self, obj):
        return obj.get_color_name()

    get_color_name_display.short_description = 'Color Name'

@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ('name', )
    search_fields = ('name', )

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', )
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('id', 'name', )

@admin.register(SubCategory)
class SubCategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'category')
    search_fields = ('id', 'name', 'category__name')
    list_filter = ('category__name',)
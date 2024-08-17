from django.urls import path
from .views import HomePage, AllProducts, ProductDetail, checkout_view, send_to_telegram_view, AllCategory, ProductsByCategory

urlpatterns = [
    path('', HomePage.as_view(), name='home'),
    path('products/', AllProducts.as_view(), name='all'),
    path('product/<slug:slug>/', ProductDetail.as_view(), name='product_detail'),
    path('categories/', AllCategory.as_view(), name='categories'),
    path('category/<slug:category_slug>/', ProductsByCategory.as_view(), name='products_by_category'),
    path('checkout/', checkout_view, name='checkout'),
    path('send-to-telegram/', send_to_telegram_view, name='send_to_telegram'),
]
